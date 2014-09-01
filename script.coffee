---
---


update = () ->
  now = new Date()
  start = new Date now.getFullYear(), now.getMonth(), now.getDate(), 9, 0
  end = new Date now.getFullYear(), now.getMonth(), now.getDate(), 17, 0

  bar = $('#progress-bar')
  title = $('title')

  ratio = (now.getTime() - start.getTime()) / (end.getTime() - start.getTime())
  ratio = if ratio < 1 then ratio else 1

  newWidth = bar.parent().innerWidth() * ratio

  title.html Math.floor(ratio * 10000)/100 + '%'
  bar.css {'width': newWidth + 'px'}

onReady = () ->
  update()
  window.setInterval update, 1000

$(document).ready onReady

