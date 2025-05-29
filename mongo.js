import mongoose from 'mongoose'

const args = process.argv
const argsNumber = args.length

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


const getUrl = password => 
    `mongodb+srv://elor170:${encodeURIComponent(password)}@cluster0.w15pcl5.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

const printPhoneBook = (password) => {
    try {
        mongoose.connect(getUrl(password))
        Person.find({})
        .then(res => {
            console.log(res);
            mongoose.connection.close()
        })
    } catch (error) {
        console.log('Error while trying to fetch data: ' + error);
    }
}

const addEntry = (password, name, number) => {
    try {
        mongoose.connect(getUrl(password))
        const newPerson = new Person({
            name: name,
            number: number
        })
        newPerson.save()
        .then(res => {
            mongoose.connection.close()
        })
    } catch (error) {
        console.log('Error while trying to fetch data: ' + error);
    }

}


if (argsNumber < 3) {
    console.log('give password as argument')
    process.exit(1)
} else if (argsNumber === 4) {
    console.log('give phone number');
    process.exit(1)
} else if (argsNumber > 5) {
    console.log('too many arguments');
    process.exit(1)
} else if (argsNumber === 3) {
    const password = args[2]
    printPhoneBook(password)
} else if (argsNumber === 5) {
    const password = args[2]
    const name = args[3]
    const number = args[4]
    addEntry(password, name, number)
}
