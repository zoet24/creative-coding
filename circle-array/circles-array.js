// Generate a grid of small, medium and large squares with randomly rounded corners with a margin between the shapes
const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1000, 2000],
};

const sketch = () => {
	const circles = []; // To keep track of all circles and their positions

	function isCircleOverlapping(newCircle) {
		for (let circle of circles) {
			const dx = circle.x - newCircle.x;
			const dy = circle.y - newCircle.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < circle.radius + newCircle.radius) {
				return true;
			}
		}
		return false;
	}

	return ({ context, width, height }) => {
		context.clearRect(0, 0, width, height);
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		const numCircles = 200;
		const cellSize = width / 20;
		const margin = width / 500;

		for (let i = 0; i < numCircles; i++) {
			let shapeSize; // size of the circle
			const rnd = Math.random();

			// Decide shape size
			if (rnd > 0.8) {
				shapeSize = cellSize * 4; // Large
			} else if (rnd > 0.4) {
				shapeSize = cellSize * 2; // Medium
			} else {
				shapeSize = cellSize; // Small
			}

			const x = Math.random() * (width - shapeSize) + shapeSize / 2;
			const y = Math.random() * (height - shapeSize) + shapeSize / 2;
			const newCircle = { x, y, radius: shapeSize / 2 };

			if (!isCircleOverlapping(newCircle)) {
				circles.push(newCircle);
				drawCircle(
					context,
					x - shapeSize / 2,
					y - shapeSize / 2,
					shapeSize,
					margin,
				);
			}
		}
	};
};

function drawCircle(ctx, x, y, size, margin) {
	const mSize = size - 2 * margin;
	const mx = x + margin + mSize / 2; // x-coordinate of circle's center
	const my = y + margin + mSize / 2; // y-coordinate of circle's center

	ctx.beginPath();
	ctx.arc(mx, my, mSize / 2, 0, 2 * Math.PI); // Draw a circle
	ctx.fillStyle = 'black';
	ctx.fill();
}

canvasSketch(sketch, settings);
