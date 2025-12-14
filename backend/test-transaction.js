/**
 * Test script to simulate Solana transactions locally
 * This helps debug transaction failures before sending to wallet
 */

const {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram,
  TransactionInstruction,
  Transaction,
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

    // Build legacy transaction (more compatible with wallets)
    console.log('🔨 Building transaction...');
    const transaction = new Transaction({
      feePayer: userPublicKey,
      recentBlockhash: blockhash,
    }).add(memoInstruction);

    // Get transaction size
    const serialized = transaction.serialize({ requireAllSignatures: false });
    console.log('✅ Transaction size:', serialized.length, 'bytes\n');

    // Simulate transaction
    console.log('🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

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

async function testSolTransfer() {
  console.log('🔍 Testing SOL Transfer Transaction...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // Use your actual wallet address here
  const USER_WALLET = '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka'; // Your Phantom wallet address
  const RECIPIENT_WALLET = '11111111111111111111111111111112'; // System program as recipient for testing
  const AMOUNT_SOL = 0.01; // Small amount for testing

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  From:', USER_WALLET);
  console.log('  To:', RECIPIENT_WALLET);
  console.log('  Amount:', AMOUNT_SOL, 'SOL\n');

  try {
    // Parse public keys
    const fromPublicKey = new PublicKey(USER_WALLET);
    const toPublicKey = new PublicKey(RECIPIENT_WALLET);
    console.log('✅ Wallet addresses are valid\n');

    // Get latest blockhash
    console.log('⏳ Fetching latest blockhash...');
    const { blockhash } = await connection.getLatestBlockhash();
    console.log('✅ Blockhash:', blockhash, '\n');

    // Create transfer instruction
    console.log('📦 Creating SOL transfer instruction...');
    const { SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: fromPublicKey,
      toPubkey: toPublicKey,
      lamports: Math.floor(AMOUNT_SOL * LAMPORTS_PER_SOL),
    });

    // Build transaction
    console.log('🔨 Building transaction...');
    const transaction = new Transaction({
      feePayer: fromPublicKey,
      recentBlockhash: blockhash,
    }).add(transferInstruction);

    // Get transaction size
    const serialized = transaction.serialize({ requireAllSignatures: false });
    console.log('✅ Transaction size:', serialized.length, 'bytes\n');

    // Simulate transaction
    console.log('🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

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

      console.log('\n✨ SOL Transfer transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', Buffer.from(serialized).toString('base64').substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

async function testSplTransfer() {
  console.log('🔍 Testing SPL Token Transfer Transaction...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // Use devnet USDC mint for testing
  const MINT_ADDRESS = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Devnet USDC
  const USER_WALLET = '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka'; // Your Phantom wallet address
  const RECIPIENT_WALLET = 'isSereA3nQ97DJXnjNFc1JAFWBF9cdH8W6tvDdogK9W'; // Some other address
  const AMOUNT = 0.01; // Small amount for testing
  const DECIMALS = 6; // USDC has 6 decimals

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Mint:', MINT_ADDRESS);
  console.log('  From:', USER_WALLET);
  console.log('  To:', RECIPIENT_WALLET);
  console.log('  Amount:', AMOUNT, 'tokens');
  console.log('  Decimals:', DECIMALS, '\n');

  try {
    // Import SPL token functions
    const {
      getAssociatedTokenAddress,
      createAssociatedTokenAccountInstruction,
      createTransferInstruction,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    } = require('@solana/spl-token');

    // Parse public keys
    const fromPublicKey = new PublicKey(USER_WALLET);
    const toPublicKey = new PublicKey(RECIPIENT_WALLET);
    const mintPublicKey = new PublicKey(MINT_ADDRESS);
    console.log('✅ Addresses are valid\n');

    // Validate mint
    const mintInfo = await connection.getAccountInfo(mintPublicKey);
    if (!mintInfo) {
      console.log('❌ Mint address not found');
      process.exit(1);
    }
    console.log('✅ Mint address is valid\n');

    // Get associated token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(mintPublicKey, fromPublicKey);
    const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, toPublicKey);

    console.log('📍 Token Accounts:');
    console.log('  From ATA:', fromTokenAccount.toBase58());
    console.log('  To ATA:', toTokenAccount.toBase58());

    // Check accounts
    const fromTokenAccountInfo = await connection.getAccountInfo(fromTokenAccount);
    const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);

    console.log('📊 Account Status:');
    console.log('  From ATA exists:', !!fromTokenAccountInfo);
    console.log('  To ATA exists:', !!toTokenAccountInfo);

    if (!fromTokenAccountInfo) {
      console.log('❌ Sender does not have token account for this mint');
      process.exit(1);
    }

    // Get latest blockhash
    console.log('\n⏳ Fetching latest blockhash...');
    const { blockhash } = await connection.getLatestBlockhash();
    console.log('✅ Blockhash:', blockhash, '\n');

    const transaction = new Transaction({
      feePayer: fromPublicKey,
      recentBlockhash: blockhash,
    });

    // If recipient's token account doesn't exist, create it
    if (!toTokenAccountInfo) {
      console.log('📦 Creating associated token account for recipient...');
      const createAtaInstruction = createAssociatedTokenAccountInstruction(
        fromPublicKey, // payer
        toTokenAccount, // associated token account
        toPublicKey, // owner
        mintPublicKey, // mint
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      transaction.add(createAtaInstruction);
    }

    // Convert amount to smallest unit
    const transferAmount = Math.floor(AMOUNT * Math.pow(10, DECIMALS));
    console.log(`💰 Transfer amount (smallest unit): ${transferAmount}`);

    if (transferAmount <= 0) {
      console.log('❌ Transfer amount too small');
      process.exit(1);
    }

    // Create transfer instruction
    console.log('📦 Creating token transfer instruction...');
    const transferInstruction = createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromPublicKey,
      transferAmount,
      [],
      TOKEN_PROGRAM_ID
    );

    transaction.add(transferInstruction);

    // Get transaction size
    const serialized = transaction.serialize({ requireAllSignatures: false });
    console.log('✅ Transaction size:', serialized.length, 'bytes\n');

    // Simulate transaction
    console.log('🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

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

      console.log('\n✨ SPL Token transfer transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', Buffer.from(serialized).toString('base64').substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

// Run test
// testMemoTransaction();
// testSolTransfer();
testSplTransfer();
