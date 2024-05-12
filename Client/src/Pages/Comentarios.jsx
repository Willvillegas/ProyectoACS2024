import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_ROOT from "../../apiRoutes";


const Comentarios = () => {
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [responses, setResponses] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [nombre, setNombre] = useState('')

    useEffect(() => {
        //simulación de una actividad (Json).
        axios.get(`${API_ROOT}/api/actividades/${id}`)
        .then(response => {
            setNombre(response.data[0].nombre);
        })
        
    }, [id]);

    useEffect(() => {
        //simulación de una actividad (Json).
        axios.get(`${API_ROOT}/api/comentarios/${id}`)
        .then(response => {
            setComments(response.data);
        })
        
    }, [id]);

    useEffect(() => {
        //simulación de una actividad (Json).
        axios.get(`${API_ROOT}/api/respuestas`)
        .then(response => {
            setResponses(response.data)
        })
        
    }, []);

    const handleSubmitComment = (event) => {
        event.preventDefault();
        const data = {
            titulo: '',
            fecha: '',
            cuerpo: newComment,
            profesor: 1,
            actividad: id,
            respuesta: 0
        }
        axios.post(`${API_ROOT}/api/comentarios`, data)
        .then(response => {
            console.log(response.data);
        })
    }

    return(
        <div className="flex flex-1 flex-col justify-center lg:px-8 items-center min-h-screen">
      <div className=" w-full bg-gray-900 p-8 rounded-lg shadow-lg mx-auto mt-10 mb-10">
        <div className="min-h-[500px] bg-gray-800 text-white">
        <header className="flex justify-between items-center px-4 py-3 ml-5">
        <div className="flex items-center">
          <div className="font-semibold text-3xl mt-5">{nombre}</div>
        </div>
      </header>
          {/* Comentarios */}
          <div className="p-4 h-[480px] overflow-y-scroll ml-2">
            {comments.map((comment)=>(
            <div>
            <div key={comment.id} className="bg-gray-700 rounded p-4 mt-5 ml-2 mr-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Usuario y fecha */}
                <div>
                  <p className="text-gray-300">{comment.nombre} - {new Date(comment.fecha).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid ">
                {/* Cuerpo */}
                <div>
                  <p className="text-gray-300">{comment.cuerpo}</p>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ml-auto">
                Responder
                </button>
              </div>
              
              {/* Respuestas */}
            </div>
                {responses.map((response)=>(
                    <div>
                        {comment.id != response.idMensaje ? <div/>:
                        <div className=" ml-20 bg-gray-700 rounded p-4 mt-5 ml-2 mr-6">
                        <p className="text-gray-300">Res- {comment.nombre} - {new Date(comment.fecha).toLocaleDateString()}</p>
                        <div>
                        <p className="text-gray-300">{comment.cuerpo}</p>
                        </div>  
                        </div>
                        }
                    </div>
                ))}
            </div>
            ))}
          </div>
        </div>
        {/* Formulario para agregar comentarios */}
        <form onSubmit={handleSubmitComment} className="w-full max-w-lg mx-auto mt-10">
            <div className="flex items-center border-b-2 border-teal-500 py-2 ">
              <input
                className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
              />
              <button
                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="submit"
              >
                Enviar
              </button>
            </div>
        </form>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded ml-2">
            Volver
          </button>
      </div>
    </div>
    )
}

export default Comentarios;