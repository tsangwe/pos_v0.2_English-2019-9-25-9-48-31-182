'use strict';

function printReceipt(inputs) {
  let itemIdCountDict = optimiseItemIdList(inputs);
  let detailedReceiptDict = detailedItemBuilder(itemIdCountDict);
  console.log(renderReceipt(detailedReceiptDict));
}

function optimiseItemIdList(itemIdList) {
  let optimisedItemIdDict = {};
  itemIdList.forEach(function(itemId) {
    // If itemId exist then add 1 else init with 1
    optimisedItemIdDict[itemId] = (optimisedItemIdDict[itemId] || 0) + 1;
  });
  return optimisedItemIdDict;
}

function detailedItemBuilder(receiptDict) {
  let detailedItemList = [];

  Object.keys(receiptDict).forEach(function(itemId) {
    let correspondDetailedItem = findItemByBarcode(itemId, receiptDict[itemId]);
    detailedItemList.push(correspondDetailedItem);
  });
  return detailedItemList;
}

function findItemByBarcode(itemId, quantity) {
  const allItemsList = loadAllItems();
  let detailedItem = allItemsList.find(detailedItem => detailedItem.barcode == itemId);
  detailedItem.quantity = quantity;
  return JSON.stringify(detailedItem);
}

function renderReceipt(receipt) {
  var subTotalList = [];
  var resultedReceiptString = "***<store earning no money>Receipt ***\n";

  receipt.forEach(function(item) {
    let itemObj = JSON.parse(item);
    let subTotal = computeSubTotal(itemObj.price, itemObj.quantity);
    subTotalList.push(subTotal);
    resultedReceiptString += "Name：" + itemObj.name + "，Quantity：" + itemObj.quantity + " ";
    if (itemObj.quantity > 1) {
      resultedReceiptString += itemObj.unit + "s"
    } else {
      resultedReceiptString += itemObj.unit
    }
    resultedReceiptString += "，Unit：" + itemObj.price.toFixed(2) + " (yuan)，Subtotal：" + subTotal.toFixed(2) + " (yuan)" + "\n";
  });

  resultedReceiptString += "----------------------\n";
  resultedReceiptString += "总计：" + computeTotal(subTotalList).toFixed(2) + " (yuan)\n";
  resultedReceiptString += "**********************"
  
  return resultedReceiptString;
}

function computeSubTotal(price, quantity) {
  return price * quantity;
}

function computeTotal(subTotalList) {
  return subTotalList.reduce((a,b) => a + b, 0);
}
