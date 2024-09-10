import { http, HttpResponse } from 'msw';

const url = '/path/to/story';

export const handlers = [
  http.put(
    url,
    () => {
      return HttpResponse.json({
        story: { title: 'Story title' },
      }).status(200);
    },
    { once: true }
  ),
  http.put(
    url,
    () => {
      return HttpResponse.json({
        story: { errors: { title: ['cannot be blank'] } },
      }).status(422);
    },
    { once: true }
  ),
  http.put(
    url,
    () => {
      return HttpResponse.json({
        story: { title: 'Story title' },
      }).status(200);
    },
    { once: true }
  ),
  http.put(
    url,
    () => {
      return HttpResponse.json({
        story: { state: 'started' },
      }).status(200);
    },
    { once: true }
  ),
  http.put(
    url,
    () => {
      return HttpResponse.json({
        story: { estimate: '1' },
      }).status(200);
    },
    { once: true }
  ),
];
