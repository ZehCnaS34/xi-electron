/**
 * Simple range class.
 */
export class Range {
  /**
   * Create the class.
   * @param  {Number} start  Starting index.
   * @param  {Number} length Length of range.
   */
  constructor(public start: number = 0, public length: number = 0) {}
}

export const N_RESERVED_STYLES = 2;
export enum STYLES {
  BLANK = -1,
  SELECTION,
  HIGHLIGHT,
}

export type StyleIdentifier = number;

/**
 * A basic type representing a range of text and and a style identifier.
 */
export class StyleSpan {

  /**
   * Given a line of text and an array of style values, generate an array of
   * StyleSpans.
   *   See https://github.com/google/xi-editor/blob/protocol_doc/doc/update.md
   * @param  {Array}  raw  Array (sorted in 3-length-tuples) of spans.
   * @param  {String} text The text of the line.
   * @return {Array}       Generated StyleSpan array.
   */
  static stylesFromRaw(raw: number[], text: string): StyleSpan[] {
    const styles = [];
    // Current position in the line.
    let pos = 0;

    // Create a blank span for any unstyled text at the start of the line.
    const firstStylePos = raw[0];
    if (firstStylePos > pos) {
      styles.push(new StyleSpan(new Range(0, firstStylePos)));
    }

    // Run over the style triplets and generate style spans for them.
    for (let i = 0; i < raw.length; i += 3) {
      const start = pos + raw[i];
      const end = start + raw[i + 1];
      const style = raw[i + 2];

      // // TODO: offsets and utf16 ???
      // // SWIFT from xi-mac:
      // let startIx = utf8_offset_to_utf16(text, start)
      // let endIx = utf8_offset_to_utf16(text, end)
      // if startIx < 0 || endIx < startIx {
      //     //FIXME: how should we be doing error handling?
      //     print("malformed style array for line:", text, raw)
      // } else {
      //     out.append(StyleSpan(range: NSMakeRange(startIx, endIx - startIx), style: style))
      // }

      styles.push(new StyleSpan(new Range(start, end - start), style));
      pos = end;
    }

    // Create a blank span for any unstyled text at the end of the line.
    if (pos < text.length) {
      styles.push(new StyleSpan(new Range(pos, text.length)));
    }

    return styles;
  }

  /**
   * Create the StyleSpan.
   * @param  {Range}           range The range of the StyleSpan.
   * @param  {StyleIdentifier} style The style's type or identifier.
   */
  constructor(public range: Range, public style: StyleIdentifier = STYLES.BLANK) {}
}
