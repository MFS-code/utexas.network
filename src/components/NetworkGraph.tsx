'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { Member, Project, Connection } from '@/data/members';
import { normalizeImageUrl } from '@/utils/profileImage';

interface NetworkGraphProps {
    members: Member[];
    projects: Project[];
    connections: Connection[];
    highlightedMemberIds?: string[];
    searchQuery?: string;
}

interface Node {
    id: string;
    name: string | null;
    profilePic: string | undefined;
    website: string | null;
    x: number;
    y: number;
    isProject?: boolean;
}

export default function NetworkGraph({ members, projects, connections, highlightedMemberIds = [], searchQuery = '' }: NetworkGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const nodesRef = useRef<Node[]>([]);
    const nodeElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const dragNodeRef = useRef<string | null>(null);
    const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const isPanningRef = useRef(false);
    const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const animationFrameRef = useRef<number | null>(null);
    const isAnimatingRef = useRef(false);
    const isDarkRef = useRef(false);
    const zoomRef = useRef(1);
    const panRef = useRef({ x: 0, y: 0 });
    const connectionsRef = useRef(connections);
    const highlightedRef = useRef(highlightedMemberIds);
    const searchQueryRef = useRef(searchQuery);

    connectionsRef.current = connections;
    highlightedRef.current = highlightedMemberIds;
    searchQueryRef.current = searchQuery;

    useEffect(() => {
        const checkDarkMode = () => {
            const theme = document.documentElement.getAttribute('data-theme');
            isDarkRef.current = theme === 'dark';
            updateVisuals();
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => observer.disconnect();
    }, []);

    const updateVisuals = useCallback(() => {
        const svg = svgRef.current;
        const nodes = nodesRef.current;
        const container = containerRef.current;
        const conns = connectionsRef.current;
        const highlighted = highlightedRef.current;
        const query = searchQueryRef.current;
        const zoom = zoomRef.current;
        const pan = panRef.current;
        const dark = isDarkRef.current;

        if (!svg || !container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        svg.innerHTML = '';
        conns.forEach((conn) => {
            const fromNode = nodes.find(n => n.id === conn.fromId);
            const toNode = nodes.find(n => n.id === conn.toId);

            if (fromNode && toNode) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                const x1 = (fromNode.x - width / 2) * zoom + width / 2 + pan.x;
                const y1 = (fromNode.y - height / 2) * zoom + height / 2 + pan.y;
                const x2 = (toNode.x - width / 2) * zoom + width / 2 + pan.x;
                const y2 = (toNode.y - height / 2) * zoom + height / 2 + pan.y;
                
                line.setAttribute('x1', x1.toString());
                line.setAttribute('y1', y1.toString());
                line.setAttribute('x2', x2.toString());
                line.setAttribute('y2', y2.toString());
                line.setAttribute('stroke', dark ? '#404040' : '#333');
                line.setAttribute('stroke-width', '1');
                line.setAttribute('opacity', '0.3');
                if (conn.dotted) {
                    line.setAttribute('stroke-dasharray', '4 4');
                    line.setAttribute('stroke', '#bf5700');
                    line.setAttribute('opacity', '0.45');
                }
                svg.appendChild(line);
            }
        });

        nodes.forEach((node) => {
            const nodeDiv = nodeElementsRef.current.get(node.id);
            if (nodeDiv) {
                const transformedX = (node.x - width / 2) * zoom + width / 2 + pan.x;
                const transformedY = (node.y - height / 2) * zoom + height / 2 + pan.y;
                
                nodeDiv.style.left = `${transformedX}px`;
                nodeDiv.style.top = `${transformedY}px`;
                nodeDiv.style.transform = `translate(-50%, -50%) scale(${zoom})`;
                
                const img = nodeDiv.querySelector('img');
                if (img) {
                    const isHighlighted = highlighted.length === 0 || highlighted.includes(node.id);
                    if (query && isHighlighted) {
                        img.style.filter = 'grayscale(0%)';
                    } else if (query && !isHighlighted) {
                        img.style.filter = 'grayscale(100%)';
                        img.style.opacity = '0.3';
                    } else {
                        img.style.filter = 'grayscale(100%)';
                        img.style.opacity = '1';
                    }
                }
            }
        });
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        isAnimatingRef.current = true;
        
        const animate = () => {
            if (isAnimatingRef.current) {
                updateVisuals();
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        if (searchQuery && highlightedMemberIds.length > 0) {
            const targetNode = nodesRef.current.find(n => highlightedMemberIds.includes(n.id));
            
            if (targetNode) {
                const newZoom = 2.5;
                zoomRef.current = newZoom;
                
                const targetZoomedX = (targetNode.x - width / 2) * newZoom + width / 2;
                const targetZoomedY = (targetNode.y - height / 2) * newZoom + height / 2;
                
                panRef.current = {
                    x: width / 2 - targetZoomedX,
                    y: height / 2 - targetZoomedY,
                };
            }
        }

        animate();

        const stopTimeout = setTimeout(() => {
            isAnimatingRef.current = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }, 600);

        return () => {
            clearTimeout(stopTimeout);
            isAnimatingRef.current = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [searchQuery, highlightedMemberIds, updateVisuals]);

    useEffect(() => {
        if (!containerRef.current || members.length === 0) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        container.innerHTML = '';
        nodeElementsRef.current.clear();

        const allEntries = [
            ...members.map(m => ({ id: m.id, name: m.name, profilePic: m.profilePic, website: m.website, isProject: false })),
            ...projects.map(p => ({ id: p.id, name: p.name, profilePic: p.profilePic, website: p.website || null, isProject: true })),
        ];

        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        nodesRef.current = allEntries.map((entry, i) => {
            const radius = Math.sqrt(i + 0.5) * (Math.min(width, height) / (2.5 * Math.sqrt(allEntries.length)));
            const angle = i * goldenAngle;

            return {
                id: entry.id,
                name: entry.name,
                profilePic: entry.profilePic,
                website: entry.website,
                x: width / 2 + radius * Math.cos(angle),
                y: height / 2 + radius * Math.sin(angle),
                isProject: entry.isProject,
            };
        });

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.transition = 'opacity 0.3s ease';
        svgRef.current = svg;
        container.appendChild(svg);

        nodesRef.current.forEach((node) => {
            const nodeDiv = document.createElement('div');
            nodeDiv.style.position = 'absolute';
            nodeDiv.style.cursor = 'grab';
            nodeDiv.style.userSelect = 'none';

            const img = document.createElement('img');
            img.src = normalizeImageUrl(node.profilePic) || '/icon.svg';
            img.style.width = node.isProject ? '28px' : '32px';
            img.style.height = node.isProject ? '28px' : '32px';
            img.style.borderRadius = node.isProject ? '6px' : '50%';
            img.style.objectFit = 'cover';
            img.style.filter = 'grayscale(100%)';
            img.style.display = 'block';
            img.draggable = false;
            img.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
            img.onerror = () => { img.src = '/icon.svg'; img.onerror = null; };

            if (node.isProject) {
                nodeDiv.style.border = '2px dashed #bf5700';
                nodeDiv.style.borderRadius = '8px';
                nodeDiv.style.padding = '3px';
            }

            const nameLabel = document.createElement('div');
            nameLabel.textContent = node.name || 'Unknown';
            nameLabel.style.position = 'absolute';
            nameLabel.style.top = '100%';
            nameLabel.style.left = '50%';
            nameLabel.style.transform = 'translateX(-50%)';
            nameLabel.style.marginTop = '4px';
            nameLabel.style.padding = '2px 6px';
            nameLabel.style.fontSize = '11px';
            nameLabel.style.fontWeight = '500';
            nameLabel.style.borderRadius = '4px';
            nameLabel.style.whiteSpace = 'nowrap';
            nameLabel.style.pointerEvents = 'none';
            nameLabel.style.opacity = '0';
            nameLabel.style.transition = 'opacity 0.2s ease';
            nameLabel.style.zIndex = '1000';
            nameLabel.style.fontFamily = 'Inter, sans-serif';

            const applyLabelTheme = () => {
                const dark = isDarkRef.current;
                nameLabel.style.background = dark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)';
                nameLabel.style.color = dark ? '#fff' : '#000';
            };
            applyLabelTheme();

            nodeDiv.addEventListener('mouseenter', () => {
                applyLabelTheme();
                img.style.filter = 'grayscale(0%)';
                img.style.opacity = '1';
                nameLabel.style.opacity = '1';
            });

            nodeDiv.addEventListener('mouseleave', () => {
                const isHighlighted = highlightedRef.current.length === 0 || highlightedRef.current.includes(node.id);
                const query = searchQueryRef.current;
                if (query && isHighlighted) {
                    img.style.filter = 'grayscale(0%)';
                    img.style.opacity = '1';
                } else if (query && !isHighlighted) {
                    img.style.filter = 'grayscale(100%)';
                    img.style.opacity = '0.3';
                } else {
                    img.style.filter = 'grayscale(100%)';
                    img.style.opacity = '1';
                }
                nameLabel.style.opacity = '0';
            });

            nodeDiv.addEventListener('mousedown', (e) => {
                (nodeDiv as any).__isDragging = false;
                dragStartRef.current = { x: e.clientX, y: e.clientY };
                isDraggingRef.current = false;
                dragNodeRef.current = node.id;
                nodeDiv.style.cursor = 'grabbing';
                const rect = container.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const zoom = zoomRef.current;
                const pan = panRef.current;
                const transformedX = (node.x - width / 2) * zoom + width / 2 + pan.x;
                const transformedY = (node.y - height / 2) * zoom + height / 2 + pan.y;
                
                dragOffsetRef.current = {
                    x: (mouseX - transformedX) * zoom,
                    y: (mouseY - transformedY) * zoom
                };
            });

            nodeDiv.addEventListener('click', () => {
                const wasDragging = (nodeDiv as any).__isDragging === true;
                if (!wasDragging && !isDraggingRef.current && node.website) {
                    const url = node.website.startsWith('http') ? node.website : `https://${node.website}`;
                    window.open(url, '_blank');
                }
                (nodeDiv as any).__isDragging = false;
            });

            nodeDiv.appendChild(img);
            nodeDiv.appendChild(nameLabel);
            container.appendChild(nodeDiv);
            nodeElementsRef.current.set(node.id, nodeDiv);
        });

        const handleContainerMouseDown = (e: MouseEvent) => {
            if (e.target === container || e.target === svgRef.current) {
                isPanningRef.current = true;
                container.style.cursor = 'grabbing';
                panStartRef.current = {
                    x: e.clientX - panRef.current.x,
                    y: e.clientY - panRef.current.y
                };
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const zoom = zoomRef.current;
            const pan = panRef.current;

            if (dragNodeRef.current && dragStartRef.current) {
                const moveDistance = Math.abs(e.clientX - dragStartRef.current.x) + Math.abs(e.clientY - dragStartRef.current.y);
                if (moveDistance > 3) {
                    isDraggingRef.current = true;
                    const nodeDiv = nodeElementsRef.current.get(dragNodeRef.current);
                    if (nodeDiv) {
                        (nodeDiv as any).__isDragging = true;
                    }
                }

                const rect = container.getBoundingClientRect();
                const node = nodesRef.current.find(n => n.id === dragNodeRef.current);
                if (node) {
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;
                    
                    node.x = ((mouseX - pan.x - width / 2) / zoom) + width / 2 - dragOffsetRef.current.x / zoom;
                    node.y = ((mouseY - pan.y - height / 2) / zoom) + height / 2 - dragOffsetRef.current.y / zoom;

                    updateVisuals();
                }
            } else if (isPanningRef.current) {
                panRef.current = {
                    x: e.clientX - panStartRef.current.x,
                    y: e.clientY - panStartRef.current.y
                };
                updateVisuals();
            }
        };

        const handleMouseUp = () => {
            if (dragNodeRef.current) {
                const nodeDiv = nodeElementsRef.current.get(dragNodeRef.current);
                if (nodeDiv) {
                    nodeDiv.style.cursor = 'grab';
                }
                isDraggingRef.current = false;
                dragNodeRef.current = null;
            }
            
            if (isPanningRef.current) {
                isPanningRef.current = false;
                container.style.cursor = '';
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            
            const zoom = zoomRef.current;
            const pan = panRef.current;
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const zoomDelta = e.deltaY > 0 ? 0.97 : 1.03;
            const newZoom = Math.min(Math.max(zoom * zoomDelta, 0.5), 5);
            
            const zoomPointX = (mouseX - pan.x - width / 2) / zoom + width / 2;
            const zoomPointY = (mouseY - pan.y - height / 2) / zoom + height / 2;
            
            zoomRef.current = newZoom;
            panRef.current = {
                x: mouseX - (zoomPointX - width / 2) * newZoom - width / 2,
                y: mouseY - (zoomPointY - height / 2) * newZoom - height / 2
            };
            
            updateVisuals();
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('mousedown', handleContainerMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        updateVisuals();

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('mousedown', handleContainerMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [members, projects, connections, updateVisuals]);

    return (
        <div 
            ref={containerRef}
            className="network-graph-container" 
            style={{ 
                width: '100%', 
                height: '400px'
            }}
        />
    );
}

