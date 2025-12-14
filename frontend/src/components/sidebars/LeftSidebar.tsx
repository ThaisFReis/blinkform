"use client";

import {
  X,
  Type,
  Hash,
  Calendar,
  CheckCircle,
  List,
  CreditCard,
  Image,
  Code,
  GitBranch,
  Shield,
  Calculator,
  Play,
} from "lucide-react";
import { useFormBuilderStore } from "@/store/formBuilderStore";

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
                  Start Info
                </div>
                <div className="text-[10px] text-gray-500">Form Introduction</div>
              </div>
            </div>

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

            {/* Date Input Node */}
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "question", "date")}
              onClick={() => handleAddNode("question", "date")}
              className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-[#460DF2]/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Date Input
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

            {/* Mint NFT Node */}
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "transaction", "nft")}
              onClick={() => handleAddNode("transaction", "nft")}
              className="flex items-center space-x-3 p-3 rounded-xl bg-[#13131A] border border-white/5 hover:border-cyan-500/50 hover:bg-[#1A1A24] cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                <Image className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Mint NFT
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
