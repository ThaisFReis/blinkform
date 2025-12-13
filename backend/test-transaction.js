/**
 * Test script to simulate Solana memo transaction locally
 * This helps debug transaction failures before sending to wallet
 */

const {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram,
  TransactionInstruction,
} = require('@solana/web3.js');

async function testMemoTransaction() {
  console.log('🔍 Testing Solana Memo Transaction...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // Use your actual wallet address here
  const USER_WALLET = '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka'; // Your Phantom wallet address

  // Test memo data (similar to what the form creates)
  const memoData = 'FormID:test-form|Answers:{"q1":"Test Answer 1","q2":"Option B"}|Timestamp:1234567890';

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Wallet:', USER_WALLET);
  console.log('  Memo:', memoData);
  console.log('  Memo size:', Buffer.from(memoData, 'utf-8').length, 'bytes\n');

  try {
    // Parse user's public key
    const userPublicKey = new PublicKey(USER_WALLET);
    console.log('✅ Wallet address is valid\n');

    // Get latest blockhash
    console.log('⏳ Fetching latest blockhash...');
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    console.log('✅ Blockhash:', blockhash, '\n');

    // Create memo instruction - Method 1: With signer in keys
    console.log('📦 Creating memo instruction (with signer)...');
    const memoInstruction = new TransactionInstruction({
      programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      keys: [
        {
          pubkey: userPublicKey,
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from(memoData, 'utf-8'),
    });

    // Build transaction message (without ComputeBudget - use default limit)
    console.log('🔨 Building transaction...');
    const messageV0 = new TransactionMessage({
      payerKey: userPublicKey,
      recentBlockhash: blockhash,
      instructions: [memoInstruction],
    }).compileToV0Message();

    // Create versioned transaction
    const transaction = new VersionedTransaction(messageV0);

    // Get transaction size
    const serialized = transaction.serialize();
    console.log('✅ Transaction size:', serialized.length, 'bytes\n');

    // Simulate transaction
    console.log('🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction, {
      sigVerify: false, // Don't verify signature (we haven't signed yet)
    });

    if (simulation.value.err) {
      console.log('❌ SIMULATION FAILED!\n');
      console.log('Error:', JSON.stringify(simulation.value.err, null, 2));
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));
      process.exit(1);
    } else {
      console.log('✅ SIMULATION SUCCESS!\n');
      console.log('Compute units used:', simulation.value.unitsConsumed);
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));

      console.log('\n✨ Transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', Buffer.from(serialized).toString('base64').substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

// Run test
testMemoTransaction();
