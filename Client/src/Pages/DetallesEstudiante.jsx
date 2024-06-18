import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_ROOT from '../../apiRoutes';
import { useAuthContext } from '../context/AuthContext';

const buttons = [
  {
    text: 'Volver',
    onClick: () => console.log("Volver"),
    roles: [1, 2, 3, 4, 5]
  },
  {
    text: 'Modificar',
    roles: [3, 4, 5]
  }
];

const Button = ({ text, onClick, key }) => (
  <button
    className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-1 px-4 rounded mr-4 active:scale-[.98] active:duration-75 hover:scale-[1.01]"
    onClick={onClick}
    key={key}
  >
    {text}
  </button>
);

const ButtonGroup = ({ buttons, userType, navigateToModificar, currentUserSede, estudianteSede }) => (
  <div className="flex justify-center">
    {buttons
      .filter(button => button.roles.some(role => role === userType) || (button.text === 'Modificar' && userType === 5))
      .map((button, index) => {
        // Agrega esta condición para verificar si el botón "Modificar" debe mostrarse
        if (button.text === 'Modificar' && currentUserSede !== estudianteSede && userType !== 5) {
          return null; // No renderizar el botón "Modificar"
        }
        return <Button key={index} text={button.text} onClick={button.onClick || navigateToModificar} />;
      })}
  </div>
);

const ProfileInfo = ({ estudianteInfo }) => (
  <div className="mb-8">
    {/* Carnet */}
    <div className="mb-4 border-b-2 border-gray-600 w-full">
      <p className="font-bold text-white">Carnet:</p>
      <p className="text-white">{estudianteInfo.carnet}</p>
    </div>
    {/* Nombre */}
    <div className="mb-4 border-b-2 border-gray-600 w-full">
      <p className="font-bold text-white">Nombre completo:</p>
      <p className="text-white">{estudianteInfo.nombre} {estudianteInfo.apellido1} {estudianteInfo.apellido2}</p>
    </div>
    {/* Correo */}
    <div className="mb-4 border-b-2 border-gray-600 w-full">
      <p className="font-bold text-white">Correo:</p>
      <p className="text-white">{estudianteInfo.correo}</p>
    </div>
    {/* Telefono */}
    <div className="mb-4 border-b-2 border-gray-600 w-full">
      <p className="font-bold text-white">Telefono:</p>
      <p className="text-white">{estudianteInfo.telefono}</p>
    </div>
    {/* Sede */}
    <div className="mb-4 border-b-2 border-gray-600 w-full">
      <p className="font-bold text-white">Sede:</p>
      <p className="text-white">{estudianteInfo.Sede}</p>
    </div>
  </div>
);

function DetallesEstudiante() {
  const { id } = useParams(); // Obtener el ID del estudiante de los parámetros de la URL
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const navigateBack = () => navigate(-1);
  const [estudianteInfo, setEstudianteInfo] = useState([]);
  const [imageSrc, setImageSrc] = useState('');
  const currentUserSede = currentUser.sede;
  console.log('ID estudiante:', id);
  useEffect(() => {
      // Fetch profile photo
      const fetchPhoto = async (idStudent) => {
        let photoUrl = '';

        if (currentUser.tipo === 5) {
          // Usuario estudiante
          photoUrl = `${API_ROOT}/api/estudiantes/photo/${idStudent}`;
        } else {
          // Otros usuarios
          photoUrl = `${API_ROOT}/api/estudiantes/photo/${id}`;
        }

        const respuesta = await fetch(photoUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'image/png',
          },
        });

        const blob = await respuesta.blob();
        const url = URL.createObjectURL(blob);
        console.log(url);
        setImageSrc(url);
      };
      fetchPhoto();
    const fetchEstudiante = async () => {
      let url = '';

      if (currentUser.tipo === 5) {
        // Usuario estudiante
        url = `${API_ROOT}/api/estudiantes/usuarioEstudiante/${currentUser.id}`;
      } else {
        // Otros usuarios
        url = `${API_ROOT}/api/estudiantes/${id}`;
      }

      await axios.get(url)
        .then(response => {
          setEstudianteInfo(response.data[0]);
          const idStudent = response.data[0].id;
          console.log(response.data);
          console.log('Estudiante obtenido a:',response.data[0].id);
          console.log('id:',idStudent);
          fetchPhoto(idStudent);

        })
        .catch(error => console.log(error));

    
    };

    fetchEstudiante();
  }, [id, currentUser.id, currentUser.tipo]);
  const navigateToModificar = () => {
    navigate(`/modificar-estudiante/${id}`); // Redirigir a la pantalla de modificación con el ID del estudiante
  };

  // Imprime currentUser.tipo en la consola del navegador
  console.log('Tipo de usuario:', currentUser.tipo);

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col justify-center items-center">
      <div className="max-w-md w-full mt-16">
        <h1 className="text-white text-center text-3xl font-bold mb-4">Estudiante</h1>
        <div className="flex justify-center items-center flex-col mb-8">
          {/* Círculo de la foto de perfil */}
          <div className="border border-gray-400 w-36 h-36 rounded-full mb-4">
            <img src={imageSrc} className="rounded-full h-36 w-36" alt="imagen del estudiante" />
          </div>
          {/* Aquí estaba el botón Subir foto de perfil, ahora eliminado */}
        </div>
        <ProfileInfo estudianteInfo={estudianteInfo} />
        <div className="flex justify-center">
          {/* Pasar currentUserSede y estudianteInfo.Sede como propiedades */}
          <ButtonGroup
            buttons={buttons.slice(1)}
            userType={currentUser.tipo}
            navigateToModificar={navigateToModificar}
            currentUserSede={currentUserSede}
            estudianteSede={estudianteInfo.Sede}
          />
          <ButtonGroup
            buttons={[{ ...buttons[0], onClick: navigateBack }]}
            userType={currentUser.tipo}
            currentUserSede={currentUserSede}
            estudianteSede={estudianteInfo.Sede}
          />
        </div>
      </div>
    </div>
  );
}

export default DetallesEstudiante;
