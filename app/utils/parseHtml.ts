function getId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}
   

// translate oembed url to youtube iframe url in html
export const parseHtml = (html: string) => {
    try {

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const oembedDomList = doc.querySelectorAll('oembed[url^="https://www.youtube.com"]');
        
        // if (oembed) {
        //     const oembedUrl = oembed.getAttribute('url').replace('watch?v=', 'embed/');
        //     const videoId = getId(oembedUrl);
    
        //     /*
        //     replace like this
        //     <div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">
        //         <iframe src="https://www.youtube.com/embed/${ videoId }"
        //                 style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"
        //                 frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
        //         </iframe>
        //     </div>
        //     */
        //     const div = doc.createElement('div');
        //     div.setAttribute('style', 'position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;');
        //     const iframe = doc.createElement('iframe');
        //     iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}`);
        //     iframe.setAttribute('style', 'position: absolute; width: 100%; height: 100%; top: 0; left: 0;');
        //     iframe.setAttribute('frameborder', '0');
        //     iframe.setAttribute('allow', 'autoplay; encrypted-media');
        //     iframe.setAttribute('allowfullscreen', '');
        //     div.appendChild(iframe);
        //     oembed.parentNode.replaceChild(div, oembed);
    
        // }
    
        oembedDomList.forEach((oembed: any) => {
            const oembedUrl = oembed.getAttribute('url').replace('watch?v=', 'embed/');
            const videoId = getId(oembedUrl);
    
            /*
            replace like this
            <div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">
                <iframe src="https://www.youtube.com/embed/${ videoId }"
                        style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                </iframe>
            </div>
            */
            const div = doc.createElement('div');
            div.setAttribute('style', 'position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;');
            const iframe = doc.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}`);
            iframe.setAttribute('style', 'position: absolute; width: 100%; height: 100%; top: 0; left: 0;');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'autoplay; encrypted-media');
            iframe.setAttribute('allowfullscreen', '');
            div.appendChild(iframe);
            oembed.parentNode.replaceChild(div, oembed);
        });
    
        // No need to convert URLs anymore - relative URLs will work through proxy
        // Images and videos with /api/files/* paths will be automatically proxied
    
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error);
        return html;
    }
}