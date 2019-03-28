import { EntityView } from "./entityView"

export class ContainerView extends EntityView {
  isContainer = true
  // You can only click the topmost entity in this container
  disablesTargetingChildren = true
}
