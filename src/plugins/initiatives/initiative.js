// @flow

import {type NodeAddressT, NodeAddress} from "../../core/graph";
import {initiativeNodeType} from "./declaration";

export type URL = string;

// Composite ID, used as input for NodeAddressT.
export opaque type InitiativeId = string[];

// Enforce that each ID has at least a sub-type and 1..n components.
export function createId(
  subType: string,
  requiredId: string,
  ...rest: string[]
): InitiativeId {
  return [subType, requiredId, ...rest];
}

export function addressFromId(id: InitiativeId): NodeAddressT {
  return NodeAddress.append(initiativeNodeType.prefix, ...id);
}

/**
 * An intermediate representation of an Initiative.
 *
 * This makes the assumption a Champion cannot fail in championing.
 * Instead of a success status, they should be removed if unsuccessful.
 *
 * There is also no timestamp for completion or each edge.
 * It should be inferred from the node timestamps instead.
 * We can support accurate edge timestamps by interpreting wiki histories.
 * However the additional complexity and requirements put on the tracker
 * don't seem worthwhile right now.
 * Especially because cred can flow even before bounties are released.
 * See https://discourse.sourcecred.io/t/write-the-initiatives-plugin/269/6
 */
export type Initiative = {|
  +title: string,
  +timestampMs: number,
  +completed: boolean,
  +tracker: NodeAddressT,
  +dependencies: $ReadOnlyArray<URL>,
  +references: $ReadOnlyArray<URL>,
  +contributions: $ReadOnlyArray<URL>,
  +champions: $ReadOnlyArray<URL>,
|};

/**
 * Represents a source of Initiatives.
 */
export interface InitiativeRepository {
  /**
   * Gets an array of all Initiatives in this repository.
   */
  initiatives(): $ReadOnlyArray<Initiative>;
}
