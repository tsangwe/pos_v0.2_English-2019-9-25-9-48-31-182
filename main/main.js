'use strict';

function printReceipt(inputs) {
  // console.log('Implement the exercise requirements here and rewrite the line of code.');
  let receiptDict = itemsToReceipt(inputs);
  let detailedReceiptDict = itemDetailSearcher(receiptDict);
  // console.log(detailedReceiptDict);
  // renderReceipt(detailedReceiptDict);
  console.log(renderReceipt(detailedReceiptDict));
}

function itemsToReceipt(itemIdList) {
  let optimisedItemIdict = {};
  itemIdList.forEach(function(itemId) {
    // If itemId exist then add 1 else init with 1
    optimisedItemIdict[itemId] = (optimisedItemIdict[itemId] || 0) + 1;
  });
  return optimisedItemIdict;
}

function itemDetailSearcher(receiptDict) {
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
  var totalPrice = 0;
  var resultedReceiptString = "***<store earning no money>Receipt ***\n";

  receipt.forEach(function(item) {
    let itemObj = JSON.parse(item);
    let subPrice = calSubPrice(itemObj.price, itemObj.quantity);
    totalPrice += subPrice;
    resultedReceiptString += "Name：" + itemObj.name + "，Quantity：" + itemObj.quantity + " ";
    if (itemObj.quantity > 1) {
      resultedReceiptString += itemObj.unit + "s"
    } else {
      resultedReceiptString += itemObj.unit
    }
    resultedReceiptString += "，Unit：" + itemObj.price.toFixed(2) + " (yuan)，Subtotal：" + subPrice.toFixed(2) + " (yuan)" + "\n";
  });

  resultedReceiptString += "----------------------\n";
  resultedReceiptString += "总计：" + totalPrice.toFixed(2) + " (yuan)\n";
  resultedReceiptString += "**********************"
  
  return resultedReceiptString;
}

function calSubPrice(price, quantity) {
  return price * quantity;
}
