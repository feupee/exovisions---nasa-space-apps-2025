import React from 'react';

/**
 * Componente reutilizável para criar um efeito de blur decorativo.
 * @param {object} props - As propriedades do componente.
 * @param {string} [props.className] - Classes customizadas do Tailwind, especialmente para POSICIONAMENTO (ex: "absolute top-0 left-0").
 * @param {string} [props.color='bg-blue-500'] - A cor de fundo do blur (ex: "bg-purple-500").
 * @param {string} [props.size='w-96 h-96'] - O tamanho do blur (ex: "w-72 h-72").
 * @param {string} [props.opacity='opacity-40'] - A opacidade do blur (ex: "opacity-50").
 * @param {string} [props.blurAmount='blur-3xl'] - A intensidade do blur (ex: "blur-2xl").
 * @param {string} [props.zIndex='z-0'] - A camada de sobreposição (ex: "z-10").
 */
export default function Blur({
  className = '',
  color = 'bg-blue-500',
  size = 'w-96 h-96',
  opacity = 'opacity-40',
  blurAmount = 'blur-3xl',
  zIndex = 'z-0',
}) {
  const combinedClasses = [
    'absolute',
    'rounded-full',
    'pointer-events-none',
    size,
    color,
    opacity,
    blurAmount,
    zIndex,
    className, // Suas classes de posicionamento vêm aqui!
  ].join(' ');

  return <div className={combinedClasses}></div>;
}