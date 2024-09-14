$version: "2.0"

namespace com.example

use aws.protocols#restJson1
use smithy.framework#ValidationException

/// Allows users to retrieve a menu, create a coffee order, and
/// and to view the status of their orders
/// @title("Coffee Shop Service")
/// @restJson1
/// service CoffeeShop {
///    version: "2024-08-23"
///    operations: [
///        GetMenu
///    ]
///    resources: [
///        Order
///    ]
///    errors: [
///        ValidationException
///    ]
/// }
/// Retrieve the menu
/// @http(method: "GET", uri: "/menu")
/// @readonly
/// operation GetMenu {
///    output := {
///        items: CoffeeItems
///    }
/// }
@title("Pantry Service")
@restJson1
service Pantry {
    version: "1"
    operations: [
        GetCounts
        AddItemType
        RemoveItemType
        UpdateCount
    ]
    errors: [
        ValidationException
    ]
}

/// Retrieve counts of items
@http(method: "GET", uri: "/counts")
@readonly
operation GetCounts {
    input: GetCountsInput
    output: GetCountsOutput
}

structure GetCountsInput {}

structure GetCountsOutput {
    @required
    counts: Items
}

/// Adds new item type
@http(method: "POST", uri: "/additemtype")
operation AddItemType {
    input: AddItemTypeInput
    output: AddItemTypeOutput
}

structure AddItemTypeInput {
    @required
    name: String
}

structure AddItemTypeOutput {}

/// Removes item type
@http(method: "POST", uri: "/removeitemtype")
operation RemoveItemType {
    input: RemoveItemTypeInput
    output: RemoveItemTypeOutput
}

structure RemoveItemTypeInput {
    @required
    name: String
}

structure RemoveItemTypeOutput {}

/// Updates count of item type
@http(method: "POST", uri: "/updatecount")
operation UpdateCount {
    input: UpdateCountInput
    output: UpdateCountOutput
}

structure UpdateCountInput {
    @required
    update: Item
}

structure UpdateCountOutput {}

structure Item {
    @required
    name: String

    @required
    count: Integer
}

list Items {
    member: Item
}
