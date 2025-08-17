const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('please provide password')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const uri = `mongodb+srv://fullstackopen:${password}@cluster0.bnpbs1n.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(uri)

const personSchema = mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => console.log(`${person.name} ${person.number}`))
      mongoose.connection.close()
    }).catch(error => {
      console.error('Error while fetching', error)
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  new Person({ name, number })
    .save()
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(error => {
      console.log(`Failed to add ${name} number ${number} to phonebook`, error)
      mongoose.connection.close()
    })
} else {
  console.log('Provide valid input')
  mongoose.connection.close()
}