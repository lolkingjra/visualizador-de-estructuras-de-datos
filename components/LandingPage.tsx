// components/LandingPage.tsx

import React from 'react';
import { TreeIcon, GraphIcon, CodeIcon, FileIcon } from './Icons';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ref, isIntersecting] = useIntersectionObserver();
    return (
        <div 
            ref={ref} 
            className={`scroll-animate ${isIntersecting ? 'scroll-animate-after' : 'scroll-animate-before'}`}
        >
            {children}
        </div>
    );
};

interface LandingPageProps {
    onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
    return (
        <div className="w-full bg-gray-900 text-white font-sans">
            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center text-center p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black opacity-50"></div>
                <AnimatedSection>
                    <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter">
                        Estructuras de Datos.
                    </h1>
                    <h2 className="text-5xl md:text-8xl font-bold text-cyan-400 tracking-tighter mt-2">
                        Hechas visibles.
                    </h2>
                    <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Una herramienta académica inmersiva para visualizar la complejidad y la elegancia de los algoritmos fundamentales.
                    </p>
                    <button
                        onClick={onEnterApp}
                        className="mt-12 px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:bg-cyan-500 transform hover:scale-105 transition-all duration-300"
                    >
                        Iniciar Laboratorio
                    </button>
                </AnimatedSection>
                <div className="absolute bottom-10 animate-bounce">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </section>

            {/* Feature 1: Árboles */}
            <section className="min-h-screen py-20 px-8 flex items-center justify-center">
                <AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <div className="text-center md:text-left">
                            <TreeIcon />
                            <h3 className="mt-4 text-4xl font-bold tracking-tighter text-white">Intuitivo. Poderoso. Equilibrado.</h3>
                            <p className="mt-4 text-gray-400">Desde la simpleza de un BST hasta la complejidad auto-balanceada de un árbol AVL, cada inserción, búsqueda y rotación se anima paso a paso, revelando la lógica interna de forma clara y concisa.</p>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl overflow-hidden">
                            <img 
                                src="/images/feature-tree.png" 
                                alt="Visualización de un árbol AVL"
                                className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500 ease-in-out"
                            />
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* Feature 2: Grafos */}
            <section className="min-h-screen py-20 px-8 flex items-center justify-center bg-black">
                 <AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl overflow-hidden order-2 md:order-1">
                             <img 
                                src="/images/feature-graph.png" 
                                alt="Cálculo del camino más corto con Dijkstra"
                                className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500 ease-in-out"
                            />
                        </div>
                        <div className="text-center md:text-left order-1 md:order-2">
                            <GraphIcon />
                            <h3 className="mt-4 text-4xl font-bold tracking-tighter text-white">Conecta los puntos. Encuentra el camino.</h3>
                            <p className="mt-4 text-gray-400">Modela redes complejas con grafos ponderados. Ejecuta algoritmos como Dijkstra, Kruskal, BFS y DFS, y observa cómo exploran el grafo para encontrar soluciones óptimas.</p>
                        </div>
                    </div>
                </AnimatedSection>
            </section>
            
            <section className="min-h-screen py-20 px-8 flex items-center justify-center">
                 <AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <div className="text-center md:text-left">
                            <div className="flex space-x-4"><CodeIcon /><FileIcon /></div>
                            <h3 className="mt-4 text-4xl font-bold tracking-tighter text-white">De la visualización al código. Y del código al estudio.</h3>
                            <p className="mt-4 text-gray-400">No solo veas cómo funciona. Entiende cómo se implementa. Cada paso se sincroniza con el código C++ equivalente. Al terminar, exporta un reporte detallado en PDF para tus notas o trabajos.</p>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl overflow-hidden">
                             <img 
                                src="/images/feature-code.png" 
                                alt="Panel de código C++ y resumen del algoritmo"
                                className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500 ease-in-out"
                            />
                        </div>
                    </div>
                </AnimatedSection>
            </section>
            
            <section className="h-screen flex flex-col items-center justify-center text-center p-8 bg-black">
                <AnimatedSection>
                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">¿Listo para explorar?</h2>
                    <button
                        onClick={onEnterApp}
                        className="mt-12 px-10 py-4 bg-white text-black font-bold text-lg rounded-lg shadow-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
                    >
                        Entrar a la Aplicación
                    </button>
                </AnimatedSection>
            </section>
        </div>
    );
};