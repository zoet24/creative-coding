// Generate a grid of squares with randomly rounded corners
const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1000, 2000],
};

const sketch = () => {
	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		const gridSizeX = width / 100; // Number of cells in X direction
		const gridSizeY = height / 100; // Number of cells in Y direction
		const cellSizeX = width / gridSizeX;
		const cellSizeY = height / gridSizeY;
		const squareSizeX = cellSizeX * 0.9;
		const squareSizeY = cellSizeY * 0.9;

		context.fillStyle = 'black';

		for (let i = 0; i < gridSizeX; i++) {
			for (let j = 0; j < gridSizeY; j++) {
				drawRoundedRectangle(
					context,
					i * cellSizeX,
					j * cellSizeY,
					squareSizeX,
					squareSizeY,
				);
			}
		}
	};
};

function drawRoundedRectangle(ctx, x, y, size) {
	const maxRadius = size / 2;
	const corners = [
		Math.random() > 0.5 ? maxRadius : 0, // Top-left
		Math.random() > 0.5 ? maxRadius : 0, // Top-right
		Math.random() > 0.5 ? maxRadius : 0, // Bottom-right
		Math.random() > 0.5 ? maxRadius : 0, // Bottom-left
	];

	ctx.beginPath();
	ctx.moveTo(x + corners[0], y);
	ctx.lineTo(x + size - corners[1], y);
	ctx.arcTo(x + size, y, x + size, y + corners[1], corners[1]);
	ctx.lineTo(x + size, y + size - corners[2]);
	ctx.arcTo(x + size, y + size, x + size - corners[2], y + size, corners[2]);
	ctx.lineTo(x + corners[3], y + size);
	ctx.arcTo(x, y + size, x, y + size - corners[3], corners[3]);
	ctx.lineTo(x, y + corners[0]);
	ctx.arcTo(x, y, x + corners[0], y, corners[0]);
	ctx.fillStyle = 'black';
	ctx.fill();
}

canvasSketch(sketch, settings);
