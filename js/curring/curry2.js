var getInfo = function (baseUrl) {
  return function (path) {
    return function (id) {
      return fetch(baseUrl + path + '/' + id)
    }
  }
}

// // ES6
// var getInfo = baseUrl => path => id => fetch(baseUrl + path + '/' + id)


var imageUrl = "http://imageAddress.com"
var productUrl = "http://productAddress.com"

// image 타입별 요청 함수 준비
var getImage = getInfo(imageUrl)
var getEmotion = getImage('emoticon')
var getIcon = getImage('icon')

// 제품 타입별 요청 함수 준비
var getProduct = getInfo(productUrl)
var getFruit = getProduct("fruit")
var getVegetable = getProduct("vegetable")


// 실제 요청 ...
var emoticon1 = getEmoticon(100)    // http://imageAddress.com/emoticon/100
var emoticon2 = getEmoticon(102)    // http://imageAddress.com/emoticon/102

var icon1 = getIcon(205)
var icon1 = getIcon(234)