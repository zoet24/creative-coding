// Generate a grid of small, medium and large squares with randomly rounded corners with a margin between the shapes and option for animation AND colour mapping
const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const colormap = require('colormap');

const settings = {
	dimensions: [1000, 2000],
	animate: false, // Set to true to animate
	duration: 237, // Set to length of song in seconds
	playbackRate: 'throttle',
};

let timeInterval = 60 / (94 * 2); // Set to BPM of song
let lastUpdateTime = 0;

const sketch = () => {
	let colour;

	const numNshades = 72;
	const colours = colormap({
		colormap: 'salinity',
		nshades: numNshades,
		format: 'hex',
		alpha: 1,
	});

	console.log(colours);
	console.log(colours[random.rangeFloor(0, 9)]);

	return ({ context, width, height, time }) => {
		// if (time - lastUpdateTime >= timeInterval) {
		context.clearRect(0, 0, width, height);

		context.fillStyle = colours[0];
		context.fillRect(0, 0, width, height);

		const gridSizeX = width / 10; // Number of cells in X direction
		const gridSizeY = height / 10; // Number of cells in Y direction
		const cellSize = width / 20;
		const margin = 0;

		// Matrix to keep track of filled cells
		const filledMatrix = Array(gridSizeX)
			.fill()
			.map(() => Array(gridSizeY).fill(false));

		// Draw shapes
		for (let i = 0; i < gridSizeX; i++) {
			for (let j = 0; j < gridSizeY; j++) {
				if (!filledMatrix[i][j]) {
					let shapeSize = cellSize; // Default to small
					const rnd = Math.random();

					// Decide shape size
					if (rnd > 0.8) {
						shapeSize = cellSize * 4; // Large
					} else if (rnd > 0.4) {
						shapeSize = cellSize * 2; // Medium
					} else {
						shapeSize = cellSize; // Small
					}

					let canDraw = true;
					// Check available space for the shape
					for (let x = 0; x < shapeSize / cellSize; x++) {
						for (let y = 0; y < shapeSize / cellSize; y++) {
							if (
								i + x >= gridSizeX ||
								j + y >= gridSizeY ||
								filledMatrix[i + x][j + y]
							) {
								canDraw = false;
								break;
							}
						}
						if (!canDraw) break;
					}

					colour = colours[random.rangeFloor(1, numNshades - 1)];

					// Draw the shape if there's enough space
					if (canDraw) {
						drawRoundedSquare(
							context,
							i * cellSize,
							j * cellSize,
							shapeSize,
							margin,
							colour,
						);

						// Mark the cells as filled based on the shape's size
						for (let x = 0; x < shapeSize / cellSize; x++) {
							for (let y = 0; y < shapeSize / cellSize; y++) {
								filledMatrix[i + x][j + y] = true;
							}
						}

						// If it's a medium or large shape, skip cells accordingly
						if (shapeSize > cellSize) {
							j += shapeSize / cellSize - 1;
						}
					}
				}
			}
		}

		// Fill in the gaps with small shapes
		for (let i = 0; i < gridSizeX; i++) {
			for (let j = 0; j < gridSizeY; j++) {
				colours[random.rangeFloor(1, numNshades - 1)];

				if (!filledMatrix[i][j]) {
					drawRoundedSquare(
						context,
						i * cellSize,
						j * cellSize,
						cellSize,
						margin,
						colour,
					);
				}
			}
		}

		// lastUpdateTime = time;
		// }
	};
};

function drawRoundedSquare(ctx, x, y, size, margin, colour = 'black') {
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
	ctx.fillStyle = colour;
	ctx.fill();
}

canvasSketch(sketch, settings);
