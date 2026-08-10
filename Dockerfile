FROM nginx:alpine

COPY index.html /usr/share/nginx/html/

COPY js/ /usr/share/nginx/html/js/

COPY asset/ /usr/share/nginx/html/asset/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]