import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';

import pv, {color} from 'bio-pv'

import {Card, Layout, Menu, theme, ConfigProvider, Button, Space, Dropdown, Typography, ColorPicker, Input, Switch } from 'antd';

// import Example from './Example'

// import Styles from './components/result_components/PV'
import { DownOutlined, SettingOutlined} from '@ant-design/icons';

const menu_background_color = 'black'
const pv_menu_font_style = {fontSize:"1.5vh", fontWeight:"bolder", color:"white", width:"25%", textAlign:"center", lineHeight:"5vh"}
const pv_menu_item_font_styles = { fontSize:"1.5vh",  fontWeight:"bolder", margin:"1% 0.2vh"};
  
const MyButton = (props) =>{
  const [buttonHoveredItem, setButtonHoveredItem] = useState();
  return(
  <span 
    style={{...props.style,backgroundColor: buttonHoveredItem  ? 'blue' : 'purple', color:"white", borderRadius: "0.5vh", fontSize:"1.5vh", padding:"0.1vh 2%", border:"0.1vh solid black"}}
    onMouseEnter={()=>setButtonHoveredItem(true)} 
    onMouseLeave={()=>setButtonHoveredItem(false)}
    onClick={props.onClickHandle}
  >
    Apply
  </span>
  )
}

const ReUploadPDBButton = (props) =>{
  const [buttonHoveredItem, setButtonHoveredItem] = useState();
  return(
  <span 
    style={{...props.style,backgroundColor: buttonHoveredItem  ? 'gray' : 'purple', color:"white", borderRadius: "0.5vh", fontSize:"1.5vh", padding:"0.5vh 3%", border:"0.1vh solid black"}}
    onMouseEnter={()=>setButtonHoveredItem(true)} 
    onMouseLeave={()=>setButtonHoveredItem(false)}
    onClick={props.onClickHandle}
  >
    Reupload PDB
  </span>
  )
}


const MyHoverItems = (props) =>{
  console.log(props);
  const [hoveredItem, setHoveredItem] = useState(null);
  return(
    <div onClick={props.onClickHandle}
      style={{...props.style, backgroundColor: hoveredItem === props.key ? 'gray' : 'transparent', color: hoveredItem === props.key ? 'white' : 'black', }} 
      onMouseEnter={()=>setHoveredItem(props.key)} 
      onMouseLeave={()=>setHoveredItem(null)}>
        {props.content}
    </div>
  )
}
const parseInputPaths = (paths) =>{
  //console.log(parseInputPaths("1-2-3-4,1-3-4-7"));
  const allosteric_paths = new Array()
  var paths = paths.trim().split(',') 
  for(var i = 0; i < paths.length; i++) {
    var nodes = paths[i].trim().split('-')
    var allosteric_path = new Array()
    for(var node_i = 0; node_i < nodes.length; node_i++) {
      allosteric_path.push(Number(nodes[node_i]))
    }
    allosteric_paths.push(allosteric_path)
  }
  return allosteric_paths
}



export default function Result(){
  
  const [PVstyle,setPVstyle] = useState("cartoon")
  const [PVcolor,setPVcolor] = useState("succession")
  const [PVlabel,setPVlabel] = useState(false)
  const [PVlabelColor,setPVlabelColor] = useState('black')
  const [PVpaths,setPVpaths] = useState([[1,2,5,6], [7,8,9,50]])
  const [PVpathStartColor,setPVpathStartColor] = useState('#2F4F4F')
  const [PVpathTubeColor,setPVpathTubeColor] = useState('grey')
  const [PVpathMiddleColor,setPVpathMiddleColor] = useState('#2F4F4F')
  const [PVpathEndColor,setPVpathEndColor] = useState('#2F4F4F')
  const [refHeight, setRefHeight] = useState();
  const [refWidth, setRefWidth] = useState();
  const [uploadPDB, setUploadPDB] = useState(false);

  //const [pvMenuStyle, setPvMenuStyle] = useState(pv_menu_font_style); # TODO
  //const [PVrotation, setPVrotation] = useState([]); # TODO
  const resizeRef = useRef(null);
  useEffect(() => {
    const resizeChange = () => {
      setRefHeight(resizeRef.current.offsetHeight)
      setRefWidth(resizeRef.current.offsetWidth)
   };
    window.addEventListener('resize', resizeChange);
    return () => window.removeEventListener('resize', resizeChange);
  }, []);

  const StyleSetting = () => {
    var items = [
      { key: 'cartoon', label: 'Cartoon',  },
      { key: 'points', label: 'Points'},
      { key: 'lines', label: 'Lines'},
      { key: 'sline', label: 'Slines'},
      { key: 'trace',label: 'Trace'},
      { key: 'tube', label: 'Tube'},
    ]
    const Content = () => <div style={{ borderRadius: "0.5vh", padding:"1vh 2% ", textAlign:'center',backgroundColor:"white", overflow:"scroll"}}>
      {items.map((item) => <MyHoverItems onClickHandle={()=>{setPVstyle(item.key)}} content={item.label} key={item.key} style={pv_menu_item_font_styles}/>)}
    </div>
    return (
      <Dropdown dropdownRender={Content}>
        <Typography.Link style={pv_menu_font_style}>
            Style
            <DownOutlined />
        </Typography.Link>
    </Dropdown>
    )
  };
  
  const ColorSetting = () => {
    const inputRef = useRef(false);
    var items = [
      { key: 'succession',label: 'Succession',  },
      { key: 'rainbow', label: 'Rainbow',  },
      // { key: 'chain',label: 'Chain',  },
      { key: 'customize', label: 'Customize',  },
    ]
    const Content = () => <div style={{ borderRadius: "0.5vh", padding:"1vh 1% ", textAlign:'center',backgroundColor:"white", overflow:"scroll"}}>
      {items.map((item) => ( 
        item.key=="customize"?
        <MyHoverItems style={pv_menu_item_font_styles}  key={item.key} content={<>
          <span > Customize:  </span>
          <input placeholder="#E6E6FA" ref={inputRef} style={{margin:"0 2%", width:"30%",  height:"2vh", color:"black"}}/>  
          <MyButton onClickHandle={()=>{setPVcolor('customize-'+inputRef.current?.value)}} style={pv_menu_item_font_styles}/>
        </>}/>
        :
        <MyHoverItems onClickHandle={()=>{setPVcolor(item.key)}} content={item.label} key={item.key} style={pv_menu_item_font_styles}/>
      ))}
    </div>
    return (
      <Dropdown dropdownRender={Content}>
        <Typography.Link style={pv_menu_font_style}>
            Color
            <DownOutlined />
        </Typography.Link>
    </Dropdown>
    )
  };
  
  const PathSetting = () => {
      const [tempChecked, setTempChecked] = useState(false)
      const inputLabelColorRef = useRef();
      const inputStartRef = useRef();
      const inputTubeRef = useRef();
      const inputMiddleRef = useRef();
      const inputEndRef = useRef();
      const inputPathsRef = useRef();
      const inputLabelRef = useRef();
      const Content = () => 
        <div style={{ borderRadius: "0.5vh", padding:"0.5vh 2% ", textAlign:'left', backgroundColor:"white", overflow:"scroll"}}>
          <div style={pv_menu_item_font_styles}>
            Path label: 
            <input type='checkbox' ref={inputLabelRef} checked={tempChecked} style={{height:"1.5vh", width:"10%", }} onClick={(e)=>{setTempChecked(e.target.checked);console.log(inputPathsRef.current?.value);}}/>
          </div>
          <div style={pv_menu_item_font_styles}>
            <span > Color of label:  </span>
            <input placeholder="black" ref={inputLabelColorRef} style={{margin:"0 2%", width:"30%",  height:"2vh", color:"black"}}/>  
          </div>
          <div style={pv_menu_item_font_styles}>
            <span > Color of start node:  </span>
            <input placeholder="#E6E6FA" ref={inputStartRef} style={{margin:"0 2%", width:"30%",  height:"2vh", color:"black"}}/>  
          </div>
          <div style={pv_menu_item_font_styles}>
            <span > Color of end node:  </span>
            <input placeholder="#E6E6FA" ref={inputEndRef} style={{margin:"0 2%", width:"30%",  height:"2vh", color:"black"}}/>  
          </div>
          <div style={pv_menu_item_font_styles}>
            <span > Color of middle node:  </span>
            <input placeholder="#E6E6FA" ref={inputMiddleRef} style={{margin:"0 2%", width:"30%",  height:"2vh", color:"black"}}/>  
          </div>
          <div style={pv_menu_item_font_styles}>
            <span > Color of path:  </span>
            <input placeholder="#E6E6FA" ref={inputTubeRef} style={{margin:"0 2%", width:"30%",  height:"2vh", color:"black"}}/>  
          </div>
          <div style={pv_menu_item_font_styles}>
            <span>Customize paths: </span>
            <input placeholder="1-2-3-4,1-3-4-7" ref={inputPathsRef} style={{margin:"0 2%", width:"50%",  height:"2vh", color:"black"}}/>      
          </div>
          <div style={{textAlign:"center"}}>
            <MyButton style={pv_menu_item_font_styles}
              onClickHandle={()=>{
              setPVlabel(tempChecked)
              // console.log(inputLabelRef.current?.value);
              if(inputLabelColorRef.current?.value!==''){ setPVlabelColor(inputLabelColorRef.current?.value)}
              if(inputStartRef.current?.value!==''){ setPVpathStartColor(inputStartRef.current?.value)}
              if(inputEndRef.current?.value!==''){ setPVpathEndColor(inputEndRef.current?.value)}
              if(inputMiddleRef.current?.value!==''){ setPVpathMiddleColor(inputMiddleRef.current?.value)}
              if(inputTubeRef.current?.value!==''){ setPVpathTubeColor(inputTubeRef.current?.value)}
              if(inputPathsRef.current?.value!==''){ setPVpaths(parseInputPaths(inputPathsRef.current?.value))}
            }}/>
          </div>
      </div>
      return (
        <ConfigProvider //no
          theme={{
            components: {
              Dropdown:{
              },
            },
          }}
        >
          <Dropdown dropdownRender={Content} placement="bottomRight">
            <Typography.Link style={pv_menu_font_style} >
                Path
                <SettingOutlined />
            </Typography.Link>
        </Dropdown>
      </ConfigProvider>
      )
  };

  const PVMenu = (props) => {
    return (
      <nav style={{display:"flex", backgroundColor:"#001529", height:"5vh", }} >
        <div style={pv_menu_font_style}><ReUploadPDBButton onClickHandle={()=>{setUploadPDB(true)}} style={pv_menu_item_font_styles}/></div>
        <StyleSetting style={pv_menu_font_style}/>
        <ColorSetting style={pv_menu_font_style}/>
        <PathSetting style={pv_menu_font_style}/>
      </nav>
      // <ConfigProvider theme={{ components: {Menu: { horizontalLineHeight:"5vh", iconMarginInlineEnd:0, dropdownWidth:"20%", itemPaddingInline:"2%"}}}}>
      //   <Menu theme="dark" onClick={onClick} style={{height:"5vh", fontSize:"1.5vh", fontWeight:"bold", backgroundColor:menu_background_color}} selectedKeys={[current]} mode="horizontal" items={items} />
      // </ConfigProvider>
    )
  };

  const PVViewer = (props) =>{
    useEffect(() => {
      var options = {
        width: refWidth ,
        height: refHeight*(0.9),
        antialias: true,
        quality: 'high',
        atomDoubleClicked:null,
        atomClicked:null,
        background : 'lightgrey',
        outline : true,
      };
      
      var pdb_filename = '/pdbs/1ake.pdb' //props.trajPDBPath
      var parent = document.getElementById('pvviewer')
      var viewer = pv.Viewer(parent, options);

      function ColorSwitch(PVcolor){
        console.log(PVcolor);
        if(PVcolor.startsWith('customize')){
          var detail = PVcolor.trim().split('-')[1]
          if(detail==''){
            return {color: color.uniform('#E6E6FA')}
          }
          return {color: color.uniform(detail)}
        }
        switch(PVcolor){
          case "succession":
            return {color: color.ssSuccession()}
          case "secondary_structure":
            return {color: color.ss()}
          case "uniform":
            return {color: color.uniform('red')}
          case "chain":
            return {color: color.byChain()}
          case "rainbow":
            return {color: color.rainbow()}
          default:
            return {color: color.ssSuccession()}
        }
      }

      function loadPDB() {
        pv.io.fetchPdb(pdb_filename, function (structure) {
          switch(PVstyle)
          {
              case "cartoon":
                viewer.cartoon('protein', structure, ColorSwitch(PVcolor));
                  break;
              case "lines":
                viewer.lines('protein', structure, ColorSwitch(PVcolor));
                  break;
              case "points":
                viewer.points('protein', structure, ColorSwitch(PVcolor));
                  break;
              case "sline":
                viewer.sline('protein', structure, ColorSwitch(PVcolor));
                break;
              case "trace":
                viewer.trace('protein', structure, ColorSwitch(PVcolor));
                break;
              case "tube":
                viewer.tube('protein', structure, ColorSwitch(PVcolor));
                break;
              default:
                viewer.cartoon('protein', structure, ColorSwitch(PVcolor));
          }        
          viewer.fitParent();
          viewer.autoZoom();
          viewer.centerOn(structure);
          // var rotation = pv.viewpoint.principalAxes(viewer.all()[0]);
          // viewer.setRotation(rotation)
  

          var prevPicked = null;
          function setColorForAtom(go, atom, color_) {
            var view = go.structure().createEmptyView();
            view.addAtom(atom);
            go.colorBy(color.uniform(color_), view);
          }
          parent.addEventListener('mousemove', function(event) {
            var rect = viewer.boundingClientRect();
            var picked = viewer.pick({ x : event.clientX - rect.left,
                                        y : event.clientY - rect.top });
            if (prevPicked !== null && picked !== null &&
                picked.target() === prevPicked.atom) {
              return;
            }
            if (prevPicked !== null) {
              setColorForAtom(prevPicked.node, prevPicked.atom, prevPicked.color);
            }
            if (picked !== null) {
              try {
                var atom = picked.target();
                // viewer.label('atom_label', atom.residue().name() + atom.residue().num(), atom.pos(), {fontSize : 16, fontColor: '#f22', backgroundAlpha : 0.4})
                document.getElementById('residue_info').innerHTML = atom.residue().name() + atom.residue().num();
                var color = [0,0,0,0];
                picked.node().getColorForAtom(atom, color);
                prevPicked = { atom : atom, color : color, node : picked.node() };
                setColorForAtom(picked.node(), atom, 'red');
              }
              catch(err) {
                document.getElementById('residue_info').innerHTML = picked._legacyObject.userData;
              }
            } else {
              prevPicked = null;
              document.getElementById('residue_info').innerHTML = '&nbsp;';
            }
            viewer.requestRedraw();
          });

          if(PVpaths!=='' && PVpaths!==null){
            for (var path_idx = 0; path_idx < PVpaths.length; path_idx++){
              var arr = PVpaths[path_idx]
              console.log(arr);
              for (var i = 0; i < arr.length; i++) { 
                let res1_atom;
                structure.select({cname: 'A', rnum:Number(arr[i]), aname: 'CA'})
                .eachAtom(function(a){ res1_atom = a; });
                let cm = viewer.customMesh('joinTheDots');
                if(i==0){cm.addSphere(res1_atom.pos(), 2, { color:PVpathStartColor, userData:'node:'+' '+res1_atom.residue().name()+res1_atom.residue().num()})}
                else if(i==arr.length -1){cm.addSphere(res1_atom.pos(), 2, { color:PVpathEndColor, userData:'node:'+' '+res1_atom.residue().name()+res1_atom.residue().num()});}
                else{cm.addSphere(res1_atom.pos(), 2, { color:PVpathMiddleColor, userData:'node:'+' '+res1_atom.residue().name()+res1_atom.residue().num()});}
                if(PVlabel && PVlabel!==null){
                    var label_options = {
                    fontSize : 16, fontColor: PVlabelColor, backgroundAlpha : 0.4
                    };
                    viewer.label('label', res1_atom.residue().name() + res1_atom.residue().num(), res1_atom.pos(), label_options);
                }
              }
              for (var i = 0; i < arr.length-1; i++) { 
                let res1_atom;
                let res2_atom;
                structure.select({cname: 'A', rnum:Number(arr[i]), aname: 'CA'})
                .eachAtom(function(a){ res1_atom = a; });
                structure.select({cname: 'A', rnum:Number(arr[i+1]), aname: 'CA'})
                .eachAtom(function(b){ res2_atom = b; });
                let cm = viewer.customMesh('joinTheDots');
                cm.addTube(res2_atom.pos(), res1_atom.pos(), .5, { cap : true, color : PVpathTubeColor, userData:'path:'+' '+res1_atom.residue().name()+res1_atom.residue().num()+'->'+res2_atom.residue().name()+res2_atom.residue().num() });
              }

            }
          }

          // document.addEventListener('keypress', function(ev) {
          //   if (ev.keyCode === 13) {
          //     var allSelections = [];
          //     viewer.forEach(function(go) {
          //       if (go.selection !== undefined) {
          //         allSelections.push(go.selection());
          //       }
          //     });
          //     viewer.fitTo(allSelections);
          //   }
          // });

          // viewer.on('click', function(picked, ev) {
          //   if (picked === null || picked.target() === null) {
          //     viewer.rm('atom_label')
          //     return;
          //   }else {
          //     prevPicked = null;
          //     viewer.rm('atom_label')
          //   }
          //   if (picked.node().structure === undefined) {
          //     return;
          //   }
          //   var atom = picked.target();
          //   viewer.label('atom_label', atom.residue().name()+atom.residue().num(), atom.pos(), {fontSize:"15", color:"red"})
          //   var extendSelection = ev.shiftKey;
          //   var sel;
          //   if (extendSelection) {
          //     var sel = picked.node().selection();
          //   } else {
          //     var sel = picked.node().structure().createEmptyView();
          //   }
          //   if (!sel.removeAtom(picked.target(), true)) {
          //     sel.addAtom(picked.target());
          //   }
          //   picked.node().setSelection(sel);
          //   prevPicked = null
          //   viewer.requestRedraw();
          // });

          // var ligands = structure.select({ rnames: ['SAH', 'RVP'] });

      });
      }
      loadPDB()
      return ()=>{
        document.removeEventListener('DOMContentLoaded', loadPDB);
      }
    },[]);
    return <div id="pvviewer" style={{height:"45vh", width:"100%", position:"relative"}}>
      <div id="residue_info" style={{position: "absolute", top:"1vh", right:"1vh", color:"white", fontSize:"1.5vh"}}></div>
    </div>;
  }


  return (
    <div style={{width:"50%", position:"relative"}} ref={resizeRef} >
      <PVMenu/>
      {uploadPDB?<>aaa</>:<PVViewer/>}
    </div>
  )

}