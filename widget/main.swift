import WidgetKit
import SwiftUI

@main
struct YourApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

@main
struct WidgetBundleEntryPoint {
    static func main() {
        // Initialize your widget bundle here
        let widgetBundle = WidgetBundle()
        WidgetCenter.shared.registerTimelineProvider(widgetBundle, context: .shared)
        
        // Start your app
        UIApplicationMain(CommandLine.argc, CommandLine.unsafeArgv, nil, NSStringFromClass(AppDelegate.self))
    }
}
