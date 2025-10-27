#!/bin/bash

# 🖼️ Script de Optimización de Imágenes - Mudanzas Elite JP
# Uso: ./optimize-images.sh

echo "🎨 Optimizando imágenes para Mudanzas Elite JP..."

# Crear directorio de assets si no existe
mkdir -p assets/original
mkdir -p assets/optimized

echo "📁 Verificando imágenes en assets/original/..."

# Función para optimizar imagen
optimize_image() {
    local input=$1
    local output=$2
    local width=$3
    local height=$4
    local quality=$5
    
    if [ -f "$input" ]; then
        echo "⚙️ Optimizando: $input -> $output"
        # Requiere ImageMagick: brew install imagemagick
        magick "$input" -resize "${width}x${height}" -quality $quality "$output"
        echo "✅ Completado: $output"
    else
        echo "⚠️ No encontrado: $input"
    fi
}

# Optimizar imagen de fondo hero (16:9)
optimize_image "assets/original/hero-background.jpg" "assets/section-1-background.png" 1920 1080 85

# Optimizar imágenes de secciones (4:3)
optimize_image "assets/original/equipo.jpg" "assets/sobre-nosotros.jpg" 800 600 80
optimize_image "assets/original/servicios.jpg" "assets/servicios.jpg" 800 600 80
optimize_image "assets/original/flota.jpg" "assets/equipos.jpg" 800 600 80
optimize_image "assets/original/garantia.jpg" "assets/confianza.jpg" 800 600 80

echo ""
echo "📊 Tamaños finales de archivos:"
ls -lh assets/*.{png,jpg} 2>/dev/null | awk '{print $9, $5}'

echo ""
echo "🎉 ¡Optimización completada!"
echo "💡 Tip: Verifica que todos los archivos sean menores a 500KB"

# Mostrar peso de archivos
echo ""
echo "📏 Verificación de peso:"
for file in assets/*.{png,jpg}; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        size_kb=$((size / 1024))
        if [ $size_kb -gt 500 ]; then
            echo "⚠️ $file: ${size_kb}KB (muy grande)"
        else
            echo "✅ $file: ${size_kb}KB (correcto)"
        fi
    fi
done
