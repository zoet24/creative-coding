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
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		// Draw each puddle
		for (const puddle of puddles) {
			puddle.draw(context);
		}
	};
};

const onMouseDown = (e) => {
	window.addEventListener('mouseup', onMouseUp);

	console.log('click');

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
		this.initRad = random.rangeFloor(30, 60);
		this.numOffset = random.rangeFloor(5, 10);
	}

	draw(context) {
		context.save();
		context.translate(this.x, this.y);

		// Set the color for the borders and bodies
		context.fillStyle = 'black';
		context.strokeStyle = 'white';

		// Draw numOffset additional puddles with increasing radius
		for (let i = this.numOffset; i > 0; i--) {
			const radius = this.initRad * Math.pow(1.25, i);

			context.beginPath();
			context.arc(0, 0, radius, 0, Math.PI * 2);
			context.lineWidth = this.numOffset / 2 + i;
			context.stroke();
			context.fill();
		}

		// Draw the center puddle
		context.beginPath();
		context.arc(0, 0, this.initRad, 0, Math.PI * 2);
		context.stroke();
		context.fill();

		context.restore();
	}
}
