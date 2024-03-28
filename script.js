import * as THREE from "https://cdn.skypack.dev/three@0.124.0";

/**DOM**/
const canvas = document.getElementById('webgl');
const sizes = {width: window.innerWidth, height: window.innerHeight}

/**Config**/
const scene = new THREE.Scene(); 

/**Images**/

const loader = new THREE.TextureLoader();
const image1 = loader.load('https://images.unsplash.com/photo-1588392382834-a891154bca4d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1510&q=80')
const image2 = loader.load('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1680&q=80')
const image3 = loader.load('https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')
const image4 = loader.load('https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')


const images = [image1, image2, image3, image4];

/** camera **/
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height, 0.1, 10 );
camera.position.set(-0.6, (images.length - 1) * 1.2, 1.6);

/**Planes**/

const group = new THREE.Group();
const plane = new THREE.PlaneGeometry(1.5, 1.1, 20, 20);

function createPlane(image) {
	const material = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
		transparent: true,
	uniforms: {
	uImage: { value: image},
	uTime: {value: 0},
	opacity: {value: 1}
}
});
	
const mesh = new THREE.Mesh(plane, material);
return mesh;
}

const planes = []
for (let image of images) {
	const newPlane = createPlane(image);
	group.add(newPlane);
	planes.push(newPlane);
}

scene.add(group);

for (let [i, plane] of planes.entries()) {
	plane.position.y = i * 1.2;
	group.rotation.y = -0.5;
	group.rotation.x = -0.3;
	group.rotation.z = -0.3;
}

/**Renderer**/
const renderer = new THREE. WebGLRenderer({canvas, alpha: true, antialias: true});
renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera) 

/** Animate **/
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	
	for (let plane of planes) {
		plane.material.uniforms.uTime.value = elapsedTime;
		
		if (plane.position.y <= camera.position.y +0.2 && plane.position.y >= camera.position.y -0.2) {
			gsap.to(plane.scale, {y: 1.1, x:1.1, z: 1.1, duration: 0.8})
			gsap.to(plane.material.uniforms.opacity, {value: 1, duration: 0.8});
		} else {
			gsap.to(plane.scale, {y: 1, x:1, z: 1, duration: 0.8})
			gsap.to(plane.material.uniforms.opacity, {value: 0.2, duration: 0.8});
		}
	}

	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
}

tick();

/** Events **/
let animating = false;

window.addEventListener('wheel', (e) => {
	 if(animating){
    return false;
  }
	
	const maxCamera = (images.length - 1) * 1.2;
	if (event.deltaY < 0) {
		if(camera.position.y < maxCamera) {
			animating = true;
			gsap.to(camera.position, {y: '+=1.2', x: '+=0.2',z:'-=0.2', duration: 0.8,onComplete: () =>  animating = false}); 
		}
 }
 else if (event.deltaY > 0.5) {
		if(camera.position.y > 1) {
			animating = true;
  	gsap.to(camera.position, {y: '-=1.2', x:'-=0.2', z:'+=0.2', duration: 0.8,onComplete: () =>  animating = false});
		}
 } 
	console.log(camera.position.y)
})

window.addEventListener('resize', ()=> {
	sizes.width = window.innerWidth; 
	sizes.height= window.innerHeight;
	
		// Update camera
	camera.aspect = sizes.width/ sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})