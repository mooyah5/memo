// case 1
enum Shoes1 {
    Nike,
    Adidas,
}

let myShoes1 = Shoes1.Nike;
console.log(myShoes1); // 0

// case 2
enum Shoes2 {
    Nike = 10,
    Adidas,
}

let myShoes2 = Shoes2.Adidas;
console.log(myShoes2); // 11

// case 3

enum Shoes3 {
    Nike = "nike",
    Adidas = "adidas",
}

let myShoes3 = Shoes3.Nike;
console.log(myShoes3); // nike
