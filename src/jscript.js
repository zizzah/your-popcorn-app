let num=  10;

console.log(num.prototype)

const hom={
    num,
    name:'name',
    age:12,
    address:{
        street:'odo',
        number:13,
        apartment:{
            floor:'2nd',
            number:100
        }
    }
}

console.log(hom.address.apartment.floor)