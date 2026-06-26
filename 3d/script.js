import React, { useState, useEffect } from "https://esm.sh/react@19"
import { createRoot } from "https://esm.sh/react-dom@19/client"
import { motion } from "https://esm.sh/motion/react"
import { ChevronLeft, ChevronRight } from "https://esm.sh/lucide-react"

const ASSETS = [
  {
    src: 'https://images.unsplash.com/photo-1769921546096-7a648d953a3e?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'urban exploration',
  },
  {
    src: 'https://images.unsplash.com/photo-1777726515600-65be20641e1b?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'night scene',
  },
  {
    src: 'https://images.unsplash.com/photo-1776582929657-9710d9cfa46a?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'yellow wildflowers',
  },
  {
    src: 'https://images.unsplash.com/photo-1776582929656-78ad8b515d75?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'street with mount fuji',
  },
  {
    src: 'https://images.unsplash.com/photo-1775990630948-3c1f696f4ab1?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'bridgestone bicycle shop',
  },
  {
    src: 'https://images.unsplash.com/photo-1775380744191-8fbff371c40b?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'train window view',
  },
  {
    src: 'https://images.unsplash.com/photo-1774775479879-082fd47d41e1?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'train tracks',
  },
  {
    src: 'https://images.unsplash.com/photo-1773544517453-95c148cb42b7?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'lawson convenience store',
  },
  {
