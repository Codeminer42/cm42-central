export default function respondToVisibility(element, callback) {
  new IntersectionObserver(entries => {
    entries.forEach(entry => callback(entry.intersectionRatio > 0))
  }).observe(element)
}


