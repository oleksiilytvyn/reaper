import { NodeType } from "../nodetype";

import { VstNode } from "./vst";
import { ItemNode } from "./item";
import { NotesNode } from './notes';
import { TrackNode } from "./track";
import { SourceNode } from "./source";
import { ProjectNode } from "./project";
import { FxChainNode } from "./fxchain";

export { VstNode, ItemNode, NotesNode, TrackNode, SourceNode, ProjectNode, FxChainNode };

/**
 * Mapping between NodeType and custom Node implementation
 */
const TypeMap = {
   [NodeType.Vst]: VstNode,
   [NodeType.Item]: ItemNode,
   [NodeType.Track]: TrackNode,
   [NodeType.Notes]: NotesNode,
   [NodeType.Source]: SourceNode,
   [NodeType.FxChain]: FxChainNode,
   [NodeType.Project]: ProjectNode,
} as const;

// Define a utility type to extract types from TypeMap
type MappedType<T extends NodeType> = T extends keyof typeof TypeMap ? typeof TypeMap[T] : Node;

/**
 * Get node type based on NodeType value (node tag name)
 * @param type
 */
export function getNodeType<T extends NodeType>(type: T): MappedType<T> {
   return TypeMap[type as string] ?? Node;
}

/**
 * Returns specific Node type based on first token
 *
 * @param line
 * @param isChunk
 */
export function createNode(line: string, isChunk: boolean = false): Node {
   const type = line.split(' ')[0];
   const node = new (TypeMap[type] ?? Node)(line);
   node.isChunk = isChunk;
   node.type = TypeMap[type] ? type as NodeType : NodeType.Default;

   return node;
}
