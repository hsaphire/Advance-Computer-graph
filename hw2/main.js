import * as THREE from 'three';

var render
var scene
var camera
function animateClock()
{
    var mesh = scene.getObjectByName('hour_hand')
    var mesh2 =scene.getObjectByName('min_hand')
    var center = new THREE.Vector3(100,50,1)
    if (mesh)
    {
        var a = new THREE.Vector3(0,0,1);
        mesh.position.sub(center);
        mesh2.position.sub(center);
        var ra = new THREE.Matrix4().makeRotationAxis(a,-1/180*Math.PI);
        var ra2 = new THREE.Matrix4().makeRotationAxis(a,-12/180*Math.PI);
        mesh.applyMatrix4(ra);
        mesh.position.add(center)
        mesh2.applyMatrix4(ra2);
        mesh2.position.add(center)
    }
    render.render(scene,camera);
    requestAnimationFrame(animateClock)
}
function main()
{
    //camera 
    camera = new THREE.OrthographicCamera( 640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000 );
    camera.position.set(0,0,0);
    
    //Geometry 
    const centerX = 100;
    const centerY = 50;
    const radius = 150;
    const numSides = 12;
    const angle = (2 * Math.PI) / numSides;
    var vertices = [];
    vertices.push( new THREE.Vector3(100,50, 0 ) );  //0
    for (let i = 0; i < numSides; i++) {
        const x = centerX + radius * Math.cos(i * angle);
        const y = centerY + radius * Math.sin(i * angle);
        const z = 0; // Z-coordinate is set to 0
    
        vertices.push(new THREE.Vector3(x, y, z));
    }
    
    //hour hand
    var vertices_hour = [];
    vertices_hour.push(new THREE.Vector3(100,50,1));
    vertices_hour.push(new THREE.Vector3(100,120,1)) ;
    vertices_hour.push(new THREE.Vector3(110,55,1));
    vertices_hour.push(new THREE.Vector3(90,55,1));

    //min hand
    var vertices_min = [];
    vertices_min.push(new THREE.Vector3(100,50,2));
    vertices_min.push(new THREE.Vector3(0,50,2)) ;
    vertices_min.push(new THREE.Vector3(95,55,2));
    vertices_min.push(new THREE.Vector3(95,45,2));
    // min hand
    //Two triangles (as indices)
    var indices = [
        0, 1, 2,
        2, 3, 0,
        0, 3, 4,
        4, 5, 0,
        0, 5, 6,
        6, 7, 0,
        0, 7, 8,
        8, 9, 0,
        0, 9, 10,
        10, 11, 0,
        0, 11, 12,
        12, 1, 0,
    ];
    var indices_hourhand = [
        0,2,1,
        1,3,0
        
    ];
    var indices_minhand = [
       0,2,1,
       1,3,0
    ]

    var geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    var geometry_hour = new THREE.BufferGeometry().setFromPoints(vertices_hour);
    var geometry_min = new THREE.BufferGeometry().setFromPoints(vertices_min);

    geometry.setIndex( indices );
    geometry_hour.setIndex(indices_hourhand);
    geometry_min.setIndex(indices_minhand)
    //background mesh
    var gridHelper = new THREE.GridHelper(500,10);
    gridHelper.geometry.rotateX( - Math.PI / 2 );
    
    //material 
    var material = new THREE.MeshBasicMaterial( { color: 0x666666 , wireframe: false} );
    var material_hour = new THREE.MeshBasicMaterial( { color: 0xEAC100 , wireframe: false} );
    var material_min = new THREE.MeshBasicMaterial( { color: 0x0080FF , wireframe: false} );
    var mesh = new THREE.Mesh(geometry, material);
    var hour_hand = new THREE.Mesh(geometry_hour,material_hour);
    var min_hand = new THREE.Mesh(geometry_min,material_min)
    //name mesh
    hour_hand.name ='hour_hand'
    min_hand.name = 'min_hand'
   
    
    //Scene 
    scene = new THREE.Scene();
    
    scene.add(hour_hand);
    scene.add(min_hand);
    scene.add(mesh);
    scene.add(camera);
    scene.add(gridHelper);
    
    //Render 
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x000000,1);
    render.setSize(640,480);
    document.body.appendChild(render.domElement);

    //render.render(scene,camera);
    animateClock()
}


main();