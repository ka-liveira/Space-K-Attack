import Player from "./classes/Player.js"; // Importa a classe Player do arquivo Player.js

const canvas = document.querySelector("canvas"); // Seleciona o canvas
const ctx = canvas.getContext("2d"); // Contexto 2D do canvas


canvas.width = innerWidth;  // Define a largura do canvas
canvas.height = innerHeight;  // Define a altura do canvas

const player = new Player(); // Cria uma nova instância do jogador