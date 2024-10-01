import { useEffect, useRef, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

const TextoInstitucion = () => {
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (textRef.current) {
      const { top, bottom } = textRef.current.getBoundingClientRect();
      // Verifica si el elemento está visible en el viewport
      if (top < window.innerHeight && bottom > 0) {
        setIsVisible(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      ref={textRef}
      className="w-11/12 max-w-2xl"
      initial={{ x: "-100%", opacity: 0 }} // Posición inicial fuera de la pantalla
      animate={{ x: isVisible ? 0 : "-100%", opacity: isVisible ? 1 : 0 }} // Cuando es visible
      transition={{
        duration: 0.6, // Reduce la duración para hacerla más rápida
        ease: "easeOut", // Cambia a una función de easing más suave
      }}
    >
      <Typography variant="h2" className="mb-2 text-customBlue text-center">
        Institución: Seguimiento de Reclamos y Garantías
      </Typography>
      <Typography color="gray" className="font-normal">
        Nuestra institución se compromete a ofrecer un servicio al cliente
        excepcional, brindando a nuestros usuarios la posibilidad de gestionar
        sus reclamos y verificar el estado de estos de manera sencilla y rápida.
        Tras la compra de un auto o la contratación de un servicio técnico, los
        clientes pueden acceder a nuestra plataforma en línea, donde encontrarán
        un espacio dedicado a sus reclamos. Aquí, podrán visualizar el historial
        de sus solicitudes, revisar el estado actual de cada reclamo y recibir
        actualizaciones en tiempo real. Esto garantiza que cada cliente esté
        siempre informado sobre el proceso de resolución, ofreciendo
        tranquilidad y confianza en el servicio postventa. Nuestro objetivo es
        asegurar que cada experiencia sea satisfactoria y que nuestros clientes
        se sientan respaldados en todo momento.
      </Typography>
    </motion.div>
  );
};

export default TextoInstitucion;