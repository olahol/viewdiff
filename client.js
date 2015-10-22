const ipc = require("ipc");
const React = require("react");
const ReactDOM = require("react-dom");
const { extname } = require("path");
const { languages }  = require("lang-map");
const { highlight } = require("highlight.js");

function Change(props) {
  const ln1 = props.normal ? props.ln1 : props.ln;
  const ln2 = props.normal ? props.ln2 : props.ln;

  let html = props.content

  try {
    html = highlight(props.lang, props.content).value;
  } catch (e) {}

  return (
    <tr className={props.type}>
      <td className="nostretch">
        {!props.add && ln1}
      </td>
      <td className="nostretch">
        {!props.del && ln2}
      </td>
      <td>
        <pre dangerouslySetInnerHTML={{__html: html}} />
      </td>
    </tr>
  );
}

function Chunk(props, index) {
  props.changes.forEach((change) => { change.lang = props.lang });

  return (
    <tbody>
      <tr className="chunk">
        <td className="nostretch">---</td>
        <td className="nostretch">+++</td>
        <td>{props.content}</td>
      </tr>
      {props.changes.map(Change)}
    </tbody>
  );
}

function Part(props, index) {
  const { from, to, additions, deletions, chunks } = props;
  const fileName = to === "/dev/null" ? from : to;

  let ext = extname(fileName);
  let langs = languages(ext);

  chunks.forEach((chunk) => { chunk.lang = langs[0] });

  return (
    <article>
      <header>
        <span className="adds">+++ {additions}</span>
        <span className="dels">--- {deletions}</span>
        <strong className="file-name">{fileName}</strong>
      </header>
      <main>
        <table>
          {chunks.map(Chunk)}
        </table>
      </main>
    </article>
  );
}

function Main(props) {
  return (
    <div>
      {props.diff.map(Part)}
    </div>
  );
}

ipc.on("diff", function (raw) {
  var diff = JSON.parse(raw);

  ReactDOM.render(<Main diff={diff} />, document.getElementById("content"));
});
