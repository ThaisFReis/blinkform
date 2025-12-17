"use client";

import {
  X,
  Type,
  Hash,
  CheckCircle,
  List,
  CreditCard,
  Image,
  Code,
  GitBranch,
  Shield,
  Calculator,
  Play,
  Coins,
  Sparkles,
  Send,
  FolderPlus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useFormBuilderStore } from "@/store/formBuilderStore";

// Dropdown Node Section Component
interface DropdownNodeSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const DropdownNodeSection: React.FC<DropdownNodeSectionProps> = ({
  title,
  icon,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-gray-400" />
        ) : (
          <ChevronRight className="w-3 h-3 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="space-y-2 ml-4">{children}</div>}
    </div>
  );
};

// Dropdown Item Component
interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  onDragStart?: (event: React.DragEvent) => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  icon,
  label,
  description,
  onClick,
  onDragStart,
}) => {
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onClick}
      className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-[#460DF2]/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
    >
      <div className="w-8 h-8 rounded-lg bg-[#460DF2]/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-200 group-hover:text-white">
          {label}
        </div>
        <div className="text-[10px] text-gray-500">{description}</div>
      </div>
    </div>
  );
};

export const LeftSidebar = () => {
  const toggleLeftSidebar = useFormBuilderStore(
    (state) => state.toggleLeftSidebar
  );
  const addNode = useFormBuilderStore((state) => state.addNode);

  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    questionType?: string
  ) => {
    const data = questionType ? `${nodeType}:${questionType}` : nodeType;
    event.dataTransfer.setData("application/reactflow", data);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleAddNode = (nodeType: string, questionType?: string) => {
    addNode(nodeType as any, undefined, questionType);
  };

  return (
    <div className="h-full flex flex-col w-80 bg-[#0C0C12]">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <h2 className="text-white font-semibold mb-1">Components</h2>
        <p className="text-xs text-gray-500">Drag to canvas to build flow</p>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Core Components Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Core Components
          </h3>
          <div className="space-y-2">
            {/* Input Node */}
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "question", "input")}
              onClick={() => handleAddNode("question", "input")}
              className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-[#460DF2]/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                <Type className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Input Field
                </div>
                <div className="text-[10px] text-gray-500">Form Element</div>
              </div>
            </div>


            {/* Choice Node */}
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "question", "choice")}
              onClick={() => handleAddNode("question", "choice")}
              className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-[#460DF2]/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-pink-400/10 flex items-center justify-center">
                <List className="w-4 h-4 text-pink-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Choice
                </div>
                <div className="text-[10px] text-gray-500">Form Element</div>
              </div>
            </div>
          </div>
        </div>

        {/* On-Chain Actions Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            On-Chain Actions
          </h3>
          <div className="space-y-4">
            {/* Token Operations Dropdown */}
            <DropdownNodeSection
              title="Token Operations"
              icon={<Coins className="w-4 h-4 text-green-400" />}
            >
              <DropdownItem
                icon={<Sparkles className="w-4 h-4 text-yellow-400" />}
                label="Create Token"
                description="New SPL token with metadata"
                onClick={() => handleAddNode('transaction', 'create-token')}
                onDragStart={(event) => onDragStart(event, 'transaction', 'create-token')}
              />
              <DropdownItem
                icon={<Coins className="w-4 h-4 text-green-400" />}
                label="Mint Tokens"
                description="Mint to existing token"
                onClick={() => handleAddNode('transaction', 'mint-tokens')}
                onDragStart={(event) => onDragStart(event, 'transaction', 'mint-tokens')}
              />
              <DropdownItem
                icon={<Send className="w-4 h-4 text-blue-400" />}
                label="Batch Airdrop"
                description="Send tokens to multiple addresses"
                onClick={() => handleAddNode('transaction', 'batch-airdrop')}
                onDragStart={(event) => onDragStart(event, 'transaction', 'batch-airdrop')}
              />
            </DropdownNodeSection>

            {/* NFT Operations Dropdown */}
            <DropdownNodeSection
              title="NFT Operations"
              icon={<Image className="w-4 h-4 text-pink-400" />}
            >
              <DropdownItem
                icon={<FolderPlus className="w-4 h-4 text-purple-400" />}
                label="Create Collection"
                description="New NFT collection"
                onClick={() => handleAddNode('transaction', 'create-nft-collection')}
                onDragStart={(event) => onDragStart(event, 'transaction', 'create-nft-collection')}
              />
              <DropdownItem
                icon={<Image className="w-4 h-4 text-pink-400" />}
                label="Mint NFT"
                description="Mint NFT from collection"
                onClick={() => handleAddNode('transaction', 'mint-nft')}
                onDragStart={(event) => onDragStart(event, 'transaction', 'mint-nft')}
              />
            </DropdownNodeSection>

            {/* Legacy Transaction Nodes */}
            <div className="space-y-2">
              {/* Generic Transaction Node */}
              <div
                draggable
                onDragStart={(event) => onDragStart(event, "transaction")}
                onClick={() => handleAddNode("transaction")}
                className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-cyan-500/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                    Transaction
                  </div>
                  <div className="text-[10px] text-gray-500">Solana Action</div>
                </div>
              </div>

              {/* Call Contract Node */}
              <div
                draggable
                onDragStart={(event) => onDragStart(event, "transaction", "contract")}
                onClick={() => handleAddNode("transaction", "contract")}
                className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-cyan-500/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                  <Code className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                    Call Contract
                  </div>
                  <div className="text-[10px] text-gray-500">Solana Action</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logic & Utilities Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Logic
          </h3>
          <div className="space-y-2">
            {/* If/Then Conditional Node */}
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "logic")}
              onClick={() => handleAddNode("logic")}
              className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-yellow-500/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Conditional
                </div>
                <div className="text-[10px] text-gray-500">Flow Control</div>
              </div>
            </div>

            {/* Validation Node */}
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "logic", "validation")}
              onClick={() => handleAddNode("logic", "validation")}
              className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-yellow-500/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Validation
                </div>
                <div className="text-[10px] text-gray-500">Flow Control</div>
              </div>
            </div>

            {/* Calculation Node */}
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "logic", "calculation")}
              onClick={() => handleAddNode("logic", "calculation")}
              className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-yellow-500/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center">
                <Calculator className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Calculation
                </div>
                <div className="text-[10px] text-gray-500">Flow Control</div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Nodes Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Terminal Nodes
          </h3>
          <div className="space-y-2">
            {/* Start Node */}
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "start")}
              onClick={() => handleAddNode("start")}
              className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-indigo-500/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-400/10 flex items-center justify-center">
                <Play className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Start Form
                </div>
                <div className="text-[10px] text-gray-500">Form Introduction</div>
              </div>
            </div>

            {/* End Form Node */}
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "end")}
              onClick={() => handleAddNode("end")}
              className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-green-500/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                  End Form
                </div>
                <div className="text-[10px] text-gray-500">Form Completion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
