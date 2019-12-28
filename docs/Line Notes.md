# Line - one-dimensional container

Items start from starting point, end-edge can be overflown.

**x, y, angle** - starting point of the line. Line can represent a row, column or completely diagonal line.

**length** - 0 by default, in `cm`, sets the point of overflow.

- `length = 0` will just keep rendering items next to each other, edge-to-edge.
- `length > 0` will try squeezing items together if they start overflowing.

**align** - "start", "end" or "center?"

- `align=end` - the "ending" cannot be overflown, even with length=0

<!--
**wrap** - false by default. Makes no sense with length 0?
**wrapReverse** - just a proposal, see later if that's needed at all?
-->

**itemAngle** - an angle at which all items are rotated by default.

**itemSpacing** - 0cm, margin or spacing (negative numbers) between items.

# Grid - two-dimensional container

Items can be placed in 2-point integer coordinate system - which is actually just calculated from `idx` and containers row/column limits.

Can also be used as 1-dimensional container, this way it would provide "max items" functionality.

Client should display available spaces in this grid.

By default, items should align in the center of grid's cells. I don't expect differently sized items to be here (for now?).

**x, y, angle** - defined the middle of this container.

**columns/rows** - number of allowed items in each direction.

- container should disallow adding more items when the limit is reached.

**cellSpacing** - each item should be fully contained within one cell of this grid. Cell Spacing provides additional air between the item and cells edge.

**itemAngle**

**itemSpacingX**

**itemSpacingY**

# Function

Item's `idx` shouldn't be simply ordered back from 0.
Items can leave empty spots in the line.

# Auto-spacing should be an option in `ParentTrait`.

- max items ? Separate trait? how to hook into addChild?

# Two parent traits?

In both cases:

- can't have negative index values

## A) ArrayParent

- Doesn't enforce max count of items
- prepending items is easy, just like in arrays
- Add child at idx - just move the rest of children idx++
-

## B) MapParent

- Can have max spots available
- Prepending child may be tricky
  - can't add if reached the limit
  - added child has to be first in container
  - the rest children are "pushed" away to fill empty spaces as needed.
- Add child at idx - that spot must be empty
