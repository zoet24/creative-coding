// Generate a grid of small and large squares with randomly rounded corners with a margin between the shapes
const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1000, 1000],
};

const sketch = () => {
	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		const gridSizeX = width / 10; // Number of cells in X direction
		const gridSizeY = height / 10; // Number of cells in Y direction
		const cellSize = width / 10;
		const margin = width / 500;

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
							i * cellSize,
							j * cellSize,
							cellSize * 2,
							margin,
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
					drawRoundedSquare(
						context,
						i * cellSize,
						j * cellSize,
						cellSize,
						margin,
					);
				}
			}
		}
	};
};

function drawRoundedSquare(ctx, x, y, size, margin) {
	const mSize = size - 2 * margin;
	const mx = x + margin;
	const my = y + margin;

	const maxRadius = mSize / 2;
	const corners = [
		Math.random() > 0.5 ? maxRadius : 0, // Top-left
		Math.random() > 0.5 ? maxRadius : 0, // Top-right
		Math.random() > 0.5 ? maxRadius : 0, // Bottom-right
		Math.random() > 0.5 ? maxRadius : 0, // Bottom-left
	];

	// const corners = [
	// 	0, // Top-left
	// 	0, // Top-right
	// 	0, // Bottom-right
	// 	0, // Bottom-left
	// ];

	ctx.beginPath();
	ctx.moveTo(mx + corners[0], my);
	ctx.lineTo(mx + mSize - corners[1], my);
	ctx.arcTo(mx + mSize, my, mx + mSize, my + corners[1], corners[1]);
	ctx.lineTo(mx + mSize, my + mSize - corners[2]);
	ctx.arcTo(
		mx + mSize,
		my + mSize,
		mx + mSize - corners[2],
		my + mSize,
		corners[2],
	);
	ctx.lineTo(mx + corners[3], my + mSize);
	ctx.arcTo(mx, my + mSize, mx, my + mSize - corners[3], corners[3]);
	ctx.lineTo(mx, my + corners[0]);
	ctx.arcTo(mx, my, mx + corners[0], my, corners[0]);
	ctx.fillStyle = 'black';
	ctx.fill();
}

canvasSketch(sketch, settings);
