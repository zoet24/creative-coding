// Generate a grid of small and large squares with randomly rounded corners
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

		// Matrix to keep track of filled cells
		const filledMatrix = Array(gridSizeX)
			.fill()
			.map(() => Array(gridSizeY).fill(false));

		// Draw large shapes first
		for (let i = 0; i < gridSizeX; i++) {
			for (let j = 0; j < gridSizeY; j++) {
				if (Math.random() > 0.75 && !filledMatrix[i][j]) {
					// Check to ensure the next cell is also available to place the large shape
					if (
						i + 1 < gridSizeX &&
						j + 1 < gridSizeY &&
						!filledMatrix[i + 1][j] &&
						!filledMatrix[i][j + 1] &&
						!filledMatrix[i + 1][j + 1]
					) {
						drawRoundedSquare(
							context,
							i * cellSizeX,
							j * cellSizeY,
							cellSizeX * 2,
						);
						filledMatrix[i][j] =
							filledMatrix[i + 1][j] =
							filledMatrix[i][j + 1] =
							filledMatrix[i + 1][j + 1] =
								true;
						j++; // Increment to skip next cell in y-direction
					}
				}
			}
		}

		// Fill in the gaps with small shapes
		for (let i = 0; i < gridSizeX; i++) {
			for (let j = 0; j < gridSizeY; j++) {
				if (!filledMatrix[i][j]) {
					drawRoundedSquare(context, i * cellSizeX, j * cellSizeY, cellSizeX);
				}
			}
		}
	};
};

function drawRoundedSquare(ctx, x, y, size) {
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
