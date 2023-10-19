// Draw randomly shaped puddles on a canvas
const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
	dimensions: [1080, 1080],
	animate: true,
};

let elCanvas;
let puddles;

const sketch = ({ canvas }) => {
	puddles = [];

	canvas.addEventListener('mousedown', onMouseDown);
	elCanvas = canvas;

	return ({ context, width, height }) => {
		context.fillStyle = '#36454F';
		context.fillRect(0, 0, width, height);

		// Draw each puddle
		for (const puddle of puddles) {
			puddle.draw(context);
		}
	};
};

const onMouseDown = (e) => {
	window.addEventListener('mouseup', onMouseUp);

	const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
	const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

	const newPuddle = new Puddle({ x, y });

	let intersects = false;
	for (const puddle of puddles) {
		const dx = puddle.x - newPuddle.x;
		const dy = puddle.y - newPuddle.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		const maxRadiusExisting = puddle.initRad * Math.pow(1.25, puddle.numOffset);
		const maxRadiusNew =
			newPuddle.initRad * Math.pow(1.25, newPuddle.numOffset);

		if (distance < maxRadiusExisting + maxRadiusNew) {
			intersects = true;
			break;
		}
	}

	if (intersects) {
		puddles.unshift(newPuddle); // Add new puddle at the beginning
	} else {
		puddles.push(newPuddle); // Add new puddle at the end
	}
};

const onMouseUp = () => {
	window.removeEventListener('mouseup', onMouseUp);
};

canvasSketch(sketch, settings);

class Puddle {
	constructor({ x, y }) {
		this.x = x;
		this.y = y;
		this.initRad = random.rangeFloor(50, 75);
		this.numOffset = random.rangeFloor(5, 10);
		this.noiseOffsetX = random.range(0, 1000); // Unique X-offset for noise
		this.noiseOffsetY = random.range(0, 1000); // Unique Y-offset for noise
	}

	draw(context) {
		context.save();
		context.translate(this.x, this.y);

		// Set the color for the borders and bodies
		context.fillStyle = '#36454F';
		context.strokeStyle = '#f7f7f7';

		// Draw numOffset additional puddles with decreasing radius
		for (let i = this.numOffset; i > 0; i--) {
			context.beginPath();
			let radius = this.initRad * Math.pow(1.25, i);

			for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
				const noiseFactor = random.noise2D(
					Math.cos(angle) + this.noiseOffsetX,
					Math.sin(angle) + this.noiseOffsetY,
					1,
					10,
				);
				const x = (radius + noiseFactor) * Math.cos(angle);
				const y = (radius + noiseFactor) * Math.sin(angle);
				context.lineTo(x, y);
			}

			context.closePath();
			context.lineWidth = this.numOffset + i;
			context.stroke();
			context.fill();
		}

		context.restore();
	}
}
