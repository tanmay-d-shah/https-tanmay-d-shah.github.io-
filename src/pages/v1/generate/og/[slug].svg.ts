import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { html as toReactElement } from 'satori-html';
import { Config } from '@eliancodes/brutal-ui';

const fontFile = await fetch(
  'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff'
);
const fontData: ArrayBuffer = await fontFile.arrayBuffer();

const height = 630;
const width = 1200;

const posts = await getCollection('blog');

export function getStaticPaths() {
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title },
  }));
}

export const get: APIRoute = async ({ params, props }) => {
  const bgColor = "#f472b6";
  const title = props.title ?? 'Tanmay Shah | Personal portfolio.';
  const link = params.slug ?? 'https://www.linkedin.com/in/tanmay-dineshkumar-shah-86533718a/';

  const html = toReactElement(`
  <div style="background-color: ${bgColor}; display: flex; flex-direction: column; height: 100%; padding: 3rem; width: 100%">
    <div style="display:flex; height: 100%; width: 100%; background-color: white; border: 6px solid black; border-radius: 0.5rem; padding: 2rem; filter: drop-shadow(6px 6px 0 rgb(0 0 0 / 1));">
      <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 2rem; width: 100%; filter: drop-shadow()">
        <div style="display: flex;">  
          <p style="font-size: 48px;">${title}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline">
          <p style="font-size: 32px">${link}</p>
        </div>
      </div>
    </div>
  </div>
  `);

  const svg = await satori(html, {
    fonts: [
      {
        name: 'Inter Latin',
        data: fontData,
        style: 'normal',
      },
    ],
    height,
    width,
  });

  return new Response(svg, {
    headers: {
      'content-type': 'image/svg',
    },
  });
};
