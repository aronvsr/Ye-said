// widget.swift
import WidgetKit
import SwiftUI

struct WidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), quoteText: "I give up drinking every week", backgroundColor: Color(hex: "b25186"))
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), quoteText: "I give up drinking every week", backgroundColor: Color(hex: "b25186"))
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []

        // Define a function to fetch the quote and check its length
        func fetchAndCheckQuote() {
            if let url = URL(string: "https://bpstudios.nl/daily_ye_backend/get_quote.php") {
                URLSession.shared.dataTask(with: url) { data, response, error in
                    if let data = data, let quoteText = String(data: data, encoding: .utf8) {
                        // Check if the quote length is less than 50 characters
                        if quoteText.count < 50 {
                            // Create an entry with the fetched quote text and desired formatting.
                            let entry = SimpleEntry(date: Date(), quoteText: quoteText, backgroundColor: Color(hex: "b25186"))
                            entries.append(entry)
                            let timeline = Timeline(entries: entries, policy: .atEnd)
                            completion(timeline)
                        } else {
                            // Quote is too long, refetch it
                            fetchAndCheckQuote()
                        }
                    }
                }.resume()
            }
        }

        // Initial call to fetch and check the quote
        fetchAndCheckQuote()
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let quoteText: String
    let backgroundColor: Color
}

struct WidgetEntryView: View {
    var entry: SimpleEntry

    var body: some View {
        let backgroundColor = UIColor(entry.backgroundColor)
        let cgBackgroundColor = backgroundColor.cgColor

        ZStack {
            Color(cgBackgroundColor)
                .edgesIgnoringSafeArea(.all)

            VStack {
                Text(entry.quoteText)
                    .font(.custom("Helvetica-Bold", size: 18))
                    .padding()
                    .foregroundColor(Color(hex: "#ffffff"))
            }
        }
    }
}

@main
struct WidgetBundle: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WidgetProvider()) { entry in
            WidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Graduation")
        .description("Everything I'm not, made me everything I am")
        .supportedFamilies([.systemSmall])
    }
}

struct Widget_Previews: PreviewProvider {
    static var previews: some View {
        WidgetEntryView(entry: SimpleEntry(date: Date(), quoteText: "I give up drinking every week", backgroundColor: Color(hex: "b25186")))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}

// Extension to convert hex color to SwiftUI Color
extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        _ = scanner.scanString("#")

        var rgb: UInt64 = 0

        scanner.scanHexInt64(&rgb)

        let red = Double((rgb & 0xFF0000) >> 16) / 255.0
        let green = Double((rgb & 0x00FF00) >> 8) / 255.0
        let blue = Double(rgb & 0x0000FF) / 255.0

        self.init(red: red, green: green, blue: blue)
    }
}
