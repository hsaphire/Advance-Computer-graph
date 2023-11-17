import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { DRACOLoader } from 'DRACOLoader';
import {XYZLoader} from 'three/addons/loaders/XYZLoader.js'
var render
var scene
var camera
let clock
const points = [];
const points2 = [];
let i =0;
const speed = 0.001;

const axis = new THREE.Vector3(0,0,1).normalize();
function animateFrame_car()
{   
    
    //Get the object from scene
    var mesh = scene.getObjectByName('TaxiCar',true)
    
    if (mesh)
    {   
        var car_position = mesh.position
        var car_nextposition = points[i];
        var race_length = points.length
        // console.log(car_position)
        mesh.position.set(car_nextposition.x,car_nextposition.y,car_nextposition.z);
        // const direction = points[i+1].clone().sub(points[i]).normalize();
        if (i%5== 0){
            
            const direction = points[i+1].clone().sub(points[i]).normalize();
            
            // mesh.rotation.x = direction.x*Math.PI/2
            // mesh.rotation.y = direction.y*Math.PI/2
            // mesh.rotation.z = direction.z*Math.PI/2            
            mesh.position.add(direction.multiplyScalar(speed));

            const anglez = -Math.atan2(direction.x,direction.y);
            // const angley = Math.atan2(direction.x,direction.z);
            // const anglex = Math.atan2(direction.y,direction.z)
            const quaternionz = new THREE.Quaternion().setFromAxisAngle(axis,anglez)
            // const quaterniony = new THREE.Quaternion().setFromAxisAngle(axis,anglex)
            // const quaternionx = new THREE.Quaternion().setFromAxisAngle(axis,angley)
            mesh.setRotationFromQuaternion(quaternionz);
            // mesh.setRotationFromQuaternion(quaterniony);
            // mesh.setRotationFromQuaternion(quaternionx);
        }
    } 
    // {
    //     const xyzloader = new THREE.FileLoader();
    //     xyzloader.load('./TrackCenter.xyz',function(data)
    //     {
            
    //         const lines = data.split('\n')
    //         lines.forEach(function(line,idx) 
    //         {
    //             setInterval(function()
    //             {   
                    
    //                 const coordinates = line.split(" ");
    //                 const x1 = parseFloat(coordinates[0]);
    //                 const y1 = parseFloat(coordinates[1]);
    //                 const z1 = parseFloat(coordinates[2]);
    //                 const x2 = parseFloat(coordinates[3]);
    //                 const y2 = parseFloat(coordinates[4]);
    //                 const z2 = parseFloat(coordinates[5]);
    //                 points.push(new THREE.Vector3(x1, y1, z1));
    //                 points.push(new THREE.Vector3(x2,y2,z2));
    //                 mesh.position.set(x1,y1,z1);
                   
    //             },1000);
    //         });
            
    //     });
    // }

    
    render.render(scene,camera);
    if (i<race_length-2){
        i++;
    }else{
        i=0;
    }
    
    requestAnimationFrame(animateFrame_car)
}
// function animateFrame_scene()
// {   
    
//     //Get the object from scene
//     var race = scene.getObjectByName('MarioKartStadium',true)
//     if (race) 
//     render.render(scene,camera);

//     requestAnimationFrame(animateFrame_scene)
// }

function main() 
{   
    clock - new THREE.Clock();

    const xyzloader = new THREE.FileLoader();
    xyzloader.load('./TrackCenter.xyz',function(data)
    {
        
        const lines = data.split('\n')
        lines.forEach(function(line) 
        {
            const coordinates = line.split(" ");
            const x1 = parseFloat(coordinates[0]);
            const y1 = parseFloat(coordinates[1]);
            const z1 = parseFloat(coordinates[2]);
            const x2 = parseFloat(coordinates[3]);
            const y2 = parseFloat(coordinates[4]);
            const z2 = parseFloat(coordinates[5]);
            points.push(new THREE.Vector3(x1, y1, z1));
            points2.push(new THREE.Vector3(x2,y2,z2))    
        });
        
    });
    
    
    scene = new THREE.Scene();
    //camera 
    camera = new THREE.OrthographicCamera( 640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000 );
    camera.position.set(0,0,0);
    camera.lookAt(0,0,0)
    // load
    new MTLLoader().load('./TaxiCar.mtl',function (meterials)
    {
        meterials.preload();
        new OBJLoader().setMaterials(meterials).load('./TaxiCar.obj',function(object)
        {   
            //object.position.set(0,10,10)
            object.name = 'TaxiCar'
            object.scale.setScalar(1);
            object.position.set(points[0].x,points[0].y,points[0].z);
           
            scene.add(object);
        });
    });
    
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./node_modules/three/examples/jsm/libs/draco/");

    var loader = new GLTFLoader() 
    loader.setDRACOLoader( dracoLoader );

    loader.load('./MarioKartStadium.glb',function(glb)
    {
        var race_track= glb.scene;
        race_track.scale.setScalar(1);
        race_track.position.set(0,0,0)
        race_track.name = 'MarioKartStadium'
        scene.add(race_track)
    })
    
    var axisHelper = new THREE.AxesHelper(100);

    var light = new THREE.PointLight( 0xffffff,10,10000,0.1);
    light.position.set(100,-100,500);

    const lighthelper = new THREE.PointLightHelper(light)
    
    //
    scene.add(camera);
    scene.add(axisHelper);
    scene.add(light);
    scene.add(lighthelper);
    
    //
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x888888,1);
    render.setSize(640,480);
    
    document.body.appendChild(render.domElement);

    animateFrame_car();
    //animateFrame_scene();
}

main()