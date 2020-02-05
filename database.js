import mongoose from 'mongoose'

export async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://viviamezquita:soft_ociteb@cluster0-a1ozs.mongodb.net/OCITEB',
      {
        useNewUrlParser: true
      }
    )
    console.log('>>> DB is connected')
  } catch (e) {
    console.log('Something goen wrong')
    console.log(e)
  }
}
