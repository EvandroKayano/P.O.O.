import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";

const bike = new Bike('bmx','caloi',123,500,'good',8,[],'001')
const bike2 = new Bike('road','speed',123,500,'average',6,[],'002')
const bike3 = new Bike('simple','common',12,250,'average',5,[],'003')
const user = new User('Evandro','ek@unifesp.br','0','444')
const user2 = new User('Keiji','ke@unifesp.br','1','670')
const user3 = new User('Kayano','kay@unifesp.br','2','698')
const today = new Date()

const appe = new App()

const twoDaysAgoToday = new Date()
twoDaysAgoToday.setDate(twoDaysAgoToday.getDate() - 2)

const sevenDaysAgoToday = new Date()
sevenDaysAgoToday.setDate(sevenDaysAgoToday.getDate()-7)


//console.log(rent1)
//console.log(bike)
appe.registerBike(bike)
appe.registerBike(bike2)
appe.addUser(user)
appe.addUser(user2)
appe.addUser(user3)

//console.log('ANTES')
//console.log(appe.users)

appe.removeUser('698')

//console.log('DEPOIS')
//console.log(appe.users)

appe.rentBike(user.email, bike.id,sevenDaysAgoToday,twoDaysAgoToday)

appe.returnBike(bike.id,user,today)

appe.rentBike(user2.email, bike2.id,sevenDaysAgoToday,twoDaysAgoToday)

//console.log(appe.rents)

appe.printBikes()
appe.printUsers()
appe.printRents()

appe.autentifyUser('670','1') //"User autentified" 