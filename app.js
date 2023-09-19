const express = require('express');
const bodyParser = require('body-parser');
const {db} = require("./src/firebase")

const app = express();
const port = 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Ruta para obtener los usuarios
app.get("/api/usuarios", async (req, res) => {
    try {
      const querySnapshot = await db.collection("users").get();
      const contacts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json({ contacts });
    } catch (error) {
      res.status(500).json({ message: 'Ocurrió un error al obtener la información.' });
    }
  }); 


// Agregar usuarios
app.post('/api/usuarios', async (req, res) => {
  // Extraer campos del cuerpo de la solicitud
  const { firstname, lastname, email, phone } = req.body;

  await db.collection("users").add({
    firstname,
    lastname,
    email,
    phone,
  });

  // Enviar una respuesta al cliente
  res.status(200).json({ message: 'Datos recibidos con éxito' });
});


//Eliminar usuario
app.delete("/api/eliminar-usuario", async (req, res) => {
    try{
        const { id } = req.body;

        await db.collection("users").doc(id).delete();
        res.status(200).json({ message: 'Usuario eliminado correctamente'})
    }catch(error){
        res.status(500).json({ message: 'Ocurrió un error al eliminar el usuario.' });
    }
    
});

// Actualiza datos de usuario
app.put("/api/actualizar-usuario", async (req, res) => {
    try {
      const { id, firstname, lastname, email, phone } = req.body;
  
      // Verifica si el documento con el ID existe antes de actualizarlo
      const userRef = db.collection("users").doc(id);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'El usuario con el ID proporcionado no existe.' });
      }
  
      // El documento existe, así que procede a actualizarlo
      await userRef.update({ firstname, lastname, email, phone });
  
      res.status(200).json({ message: 'Usuario editado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Ocurrió un error al editar el usuario.' });
    }
  });  


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
