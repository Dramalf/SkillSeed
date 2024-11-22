import { useEffect, useState, useRef } from "react"
import { sendToBackground } from "@plasmohq/messaging"
import { Graph } from '@antv/g6';
import "./sidepanel.css"
import { BorderInnerOutlined, DeleteFilled, EyeFilled, RedoOutlined, YoutubeOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space, Tag, Flex, Skeleton ,FloatButton} from "antd";

const resetTree = () => {
    sendToBackground({ name: 'resetTree', body: {} })
}
const generateTechLabelsMap = (label_techs_map) => {
    let tech_labels_map = {}
    Object.entries(label_techs_map).forEach(([key, value]) => {
        value.forEach((v) => {
            if (!tech_labels_map[v]) {
                tech_labels_map[v] = []
            }
            tech_labels_map[v].push(key)
        })
    })
    return tech_labels_map
}

function IndexSidePanel() {
    const [selectedNode, setSelectedNode] = useState('')
    const [nodeNameInput, setNodeNameInput] = useState('')
    const [techMeme, setTechMeme] = useState('')
    const [isWaiting, setIsWaiting] = useState(false)
    const [showYoutube, setShowYoutube] = useState(false)
    useEffect(() => {
        window.onresize = function () {
            graphRef.current && graphRef.current.resize()
        }
    }, [])
    useEffect(() => {
        if(selectedNode){
            setIsWaiting(true);
            sendToBackground({ name: "techMeme", body: { tech: selectedNode } }).then(res => {
                console.log(res, 'res')
                setTechMeme(res.meme)
            }).finally(() => {
                setIsWaiting(false)
            })
        }
    }, [selectedNode])
    const requestGraphData = () => {
        const size = (node) => Math.max(...node.style.size);
        containerRef.current.innerHTML = ''
        sendToBackground({ name: 'initSidepanel', data: {} }).then(res => {
            // console.log(res)
            let label_techs_map = res.message.data;
            console.log(label_techs_map, 'data')
            let tech_labels_map = generateTechLabelsMap(label_techs_map);
            graphDataRef.current = {
                tech_labels_map, label_techs_map
            }
            let nodes = [];
            let edges = [];
            let map = {};
            let edgesMap = {}
            Object.entries(label_techs_map).forEach(([key, value]) => {
                if (map[key] !== true) {
                    map[key] = true;
                    nodes.push({ id: key, "data": { category: "A", name: key } });
                }

                value.forEach((v) => {
                    if (map[v] !== true) {
                        map[v] = true;
                        nodes.push({ id: v, data: { category: "B", name: v } });
                    }
                    // edges.push({from:v,to:key})
                    if (v !== key && edgesMap[v + '-' + key] !== true) {
                        edgesMap[v + '-' + key] = true
                        edges.push({ id: v + '-' + key, source: v, target: key })
                    }

                })
            })
            if(nodes.length==0){
                setShowYoutube(true);
            }
            const graph = new Graph({
                container: containerRef.current,
                autoFit: 'view',
                data: {
                    nodes, edges
                },
                node: {
                    style: {
                        label: true,
                        labelText: (d) => d.data?.name,
                        // labelBackground: true,
                        fillOpacity: 1,
                    },

                    palette: {
                        type: 'group', // 指定色板类型为分类色板
                        field: 'category', // 指定数据中的分组字段
                        color: 'tableau', // 使用 tableau 色板
                    },
                },
                layout: {
                    type: 'd3-force',
                    link: { distance: (edge) => size(edge.source) + size(edge.target) },
                    collide: { radius: (node) => size(node) },
                    manyBody: { strength: (node) => -4 * size(node) },
                    animation: false,
                },
                transforms: [
                    {
                        type: 'map-node-size',
                        scale: 'linear',
                        maxSize: 60,
                        minSize: 20,
                        mapLabelSize: [12, 24]
                    },
                ],
                behaviors: [
                    'drag-canvas',
                    'zoom-canvas',
                    'click-select',
                    {
                        type: 'focus-element',
                        key: 'focus-element',
                    },
                    function () {
                        return {
                            key: 'hover-activate',
                            type: 'hover-activate',
                            enable: (e) => e.targetType === 'node',
                            degree: 1,
                            inactiveState: 'inactive',
                            onHover: (e) => {
                                this.frontElement(e.target.id);
                                e.view.setCursor('pointer');
                            },
                            onHoverEnd: (e) => {
                                e.view.setCursor('default');
                            },
                        };
                    },
                    {
                        type: 'fix-element-size',
                        enable: true,
                    },
                    'auto-adapt-label'
                ],
                animation: true,
            });
            graph.render();
            graph.on('node:click', (e) => {
                graphRef.current.setElementState(selectedNode, 'inactive');
                setNodeNameInput(e.target?.config.id);
                setSelectedNode(e.target?.config.id);
            });
            graphRef.current = graph
        })
    }
    useEffect(() => {
        requestGraphData();
    }, [])
    const containerRef = useRef(null)
    const graphRef = useRef(null)
    const graphDataRef = useRef(null)

    const renderTags = (selected_name) => {
        if (graphDataRef.current == null) {
            return <div></div>
        }
        const isTech = selected_name in graphDataRef.current.tech_labels_map;
        const color = isTech ? "#1F77B4" : "#FF7F0E";
        return <Flex className="tag-area-box">

            <Flex gap="4px 0" wrap>
                {graphDataRef.current[isTech ? "tech_labels_map" : "label_techs_map"]?.[selected_name]?.map((t) => <Tag color={color} onClick={() => {

                    graphRef.current.setElementState(selectedNode, 'inactive');
                    setNodeNameInput(t);
                    setSelectedNode(t);
                    graphRef.current.setElementState(t, 'highlight');
                    graphRef.current.focusElement(t, true);
                }}>{t}</Tag>)}
            </Flex>
        </Flex>
    }
    return <div
        style={{
            display: "flex",
            flexDirection: "column",
            padding: 8
        }}>
        <div id="container" style={{display:showYoutube?"none":""}}className="graph-container" ref={containerRef}>
        </div>
        {showYoutube&&<iframe className="graph-container" src="https://www.youtube.com/embed/B0bdoK4BdQg?si=4asRKzMCHuVUcPbB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        }
        <FloatButton.Group shape="circle" style={{ insetInlineEnd: 30,bottom:"30vh" }}>
            <FloatButton icon={!showYoutube?<YoutubeOutlined />:<EyeFilled />} onClick={()=>{
                setShowYoutube(!showYoutube);
            }}></FloatButton>
      <FloatButton icon={<RedoOutlined />} onClick={()=>{
        requestGraphData();
      }}/>
      <FloatButton icon={<BorderInnerOutlined />} onClick={()=>{
        graphRef.current.fitView({ padding: 20})
      }}/>
    </FloatButton.Group>
        <Card title={
            selectedNode ? <Space.Compact style={{ width: '50%' }}>
                <Input value={nodeNameInput} onChange={e => setNodeNameInput(e.target.value.toLowerCase())} />
                <Button type="primary" onClick={(e) => {
                    let nodeLabels = graphDataRef.current.tech_labels_map[selectedNode];
                    sendToBackground({ name: 'updateName', body: { node: selectedNode, new_name: nodeNameInput, nodeLabels } })
                    graphRef.current.updateNodeData([{ id: selectedNode, data: { name: nodeNameInput } }])
                    setSelectedNode(nodeNameInput)
                    if (selectedNode in graphDataRef.current.tech_labels_map) {
                        graphDataRef.current.tech_labels_map[nodeNameInput] = graphDataRef.current.tech_labels_map[selectedNode];
                        delete graphDataRef.current.tech_labels_map[selectedNode];
                        graphDataRef.current.tech_labels_map[nodeNameInput].forEach((label) => {
                            techs = graphDataRef.current.label_techs_map[label]
                            techs = techs.filter(tech => tech != selectedNode);
                            techs.push(nodeNameInput);
                            graphDataRef.current.label_techs_map[label] = techs;
                        })
                    } else {
                        graphDataRef.current.label_techs_map[nodeNameInput] = graphDataRef.current.label_techs_map[selectedNode];
                        delete graphDataRef.current.label_techs_map[selectedNode];
                        graphDataRef.current.label_techs_map[nodeNameInput].forEach((tech) => {
                            labels = graphDataRef.current.tech_labels_map[tech]
                            labels = labels.filter(label => label != selectedNode);
                            labels.push(nodeNameInput);
                            graphDataRef.current.tech_labels_map[tech] = labels;
                        })

                    }
                    graphRef.current.draw()
                }}>update</Button>
            </Space.Compact> : <h3>Welcome to SkillSeed!</h3>
        }
            extra={selectedNode ? <DeleteFilled onClick={() => {
                graphRef.current.removeNodeData([selectedNode])
                graphRef.current.draw()

                sendToBackground({ name: 'deleteNode', body: { node: selectedNode, nodeLabels: graphDataRef.current.tech_labels_map[selectedNode] } })
            }} /> : null}
            className="node-card">
            {selectedNode && renderTags(selectedNode)}
            {isWaiting && <Skeleton active paragraph={{ rows: 1 }} />}
            {!isWaiting&&techMeme && <Flex class="meme-container">
                <p class="meme-text">
                    {techMeme}
                </p>
            </Flex>
            }
            {!selectedNode && <>
                <p>🔨This is a chrome extension helps to record and visualize your tech skills🧑‍💻</p>
                <p>🪜With the help of built-in AI, efficiently and safely analyzing your learning roadmap🔐</p>
                <p>🚀Start by browsing any webpage and try to learn something!🌲</p>
            </>}
        </Card>

    </div>

}

export default IndexSidePanel