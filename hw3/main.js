///////////////////////////////////////////////
///      define import package             ///
//////////////////////////////////////////////
import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'DRACOLoader';
///////////////////////////////////////////////
///     define global variable              ///
///////////////////////////////////////////////
var render
var scene
var camera
var controls
var camera2 

var rotation_center = new THREE.Vector3(110,40,10)
var speed = Math.PI/180.0*0.5
var rotation_axis = new THREE.Vector3(0,1,0)
///////////////////////////////////////////////
/// function animateFrame is used for doing ///
///  dynamic change of mesh                 ///
///////////////////////////////////////////////
function animateFrame()
{   
    var light = scene.getObjectByName('MyPTlihght') // get mesh by name
    var camera2 = scene.getObjectByName("camera2")

    if (light)                                      // if "light" is True
    {
        var pt = light.position.clone()             // apply matrix and move light to next position
        var ra = new THREE.Matrix4()
        ra.makeRotationY(Math.PI/180.0*0.5)
        pt.applyMatrix4(ra)
        light.position.x = pt.x;
        light.position.y = pt.y;
        light.position.z = pt.z;
        whirl(camera2,rotation_axis,speed,rotation_center) // call function whirl
    }

    controls.update();    
    render.render(scene,camera2);                   
   
    requestAnimationFrame(animateFrame)
}
///////////////////////////////////////////////////
/// Create a function "whirl"doing rotaion and  ///
/// add some varible to change status including ///
/// mesh, axis and center of rotation and speed ///
///////////////////////////////////////////////////

function whirl(mesh,axis,speed,center){
    mesh.position.sub(center);                                              // let mesh position nomalize 
    var rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis,speed);
    mesh.applyMatrix4(rotationMatrix);
    mesh.position.add(center);                                              // add center to position thay we need 
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();

    //camera (as globle var)
    camera = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 5, 3000)
    camera.position.set(-150,40,300);
    camera.lookAt(0,0,0)
    scene.add(camera);
    
    

    ////////////////////////////////////
    /// Set parameter of camara 2    ///
    ////////////////////////////////////
    camera2 = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 5, 3000)
    camera2.position.set(170,40,10);
    camera2.lookAt(110,40,-60)
    camera2.near=0.1
    camera2.fov =20
    camera2.far = 50
    camera2.rotation.z = -Math.PI/2;
    camera2.name = "camera2"
    scene.add(camera2)
    const helper = new THREE.CameraHelper( camera2 );
    scene.add( helper );

    //material 
    var materialWire = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true })
    
    ////////////////////////////////////
    /// Loading Earth.glb            ///
    ////////////////////////////////////
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./node_modules/three/examples/jsm/libs/draco/");

    var loader = new GLTFLoader() 
    loader.setDRACOLoader( dracoLoader );

    loader.load('./Earth.glb',function(glb)
    {
        var earth_glb= glb.scene;
        var box = new THREE.Box3().setFromObject(earth_glb);
        var center = box.getCenter(new THREE.Vector3());
        console.log(center)
        earth_glb.scale.setScalar(1);
        
        earth_glb.name = 'Earth'
        glb.scene.traverse(function(node){
            if (node.isMesh){
                node.castShadow = true;
                node.receiveShadow = true;
            }
        })
        scene.add(earth_glb)
    })


    // Plane structure
    var planeGeometry = new THREE.PlaneGeometry(1500, 1500)
    var plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ color: 0xBBAABB }))
    plane.position.z = -100
    plane.receiveShadow = true
    //scene.add(plane)

    const geometry = new THREE.BoxGeometry(50, 50, 50);
    var cube = new THREE.Mesh(geometry,  materialWire ) 
    cube.position.set(100, 0, 25)
    cube.castShadow = true
    cube.receiveShadow = true
    // scene.add(cube)

    //
    var axisHelper = new THREE.AxesHelper(100);
    scene.add(axisHelper);
    
    var light = new THREE.PointLight( 0xffffff, 10, 10000, 0.05)
    light.name = 'MyPTlihght'
    light.position.set(200, 0, 300)
    light.castShadow = true
    light.shadow.mapSize.width = 512 
    light.shadow.mapSize.height = 512 
    light.shadow.camera.near = 10
    light.shadow.camera.far = 10000
    
    scene.add(light)

    const lighthelper = new THREE.PointLightHelper(light) 
    scene.add(lighthelper)

    
    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;
    render.setClearColor(0x000000,1);
    render.setSize(640, 480);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
   
    animateFrame();
}


main();