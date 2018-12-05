//
//  ViewController.swift
//  batman-notification
//
//  Created by Gregori, Lars on 03.12.18.
//  Copyright © 2018 Gregori, Lars. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    @IBOutlet weak var address: UITextField!
    @IBOutlet weak var postcode: UITextField!
    @IBOutlet weak var town: UITextField!
    

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    
    func newNotification(applicationState: UIApplication.State, orderId: String?, userName: String?, address0: String?, postalCode0: String?, town0: String?) {

        print("NEW NOTIFICATION ... state:", applicationState.rawValue)
        
        if userName != nil {
            address.text = address0 ?? "-"
            postcode.text = postalCode0 ?? "-"
            town.text = town0 ?? "-"
        } else {
            let url = "https://batstore.cqz1m-softwarea1-d1-public.model-t.cc.commerce.ondemand.com/cart"
            if let link = URL(string: url) {
                UIApplication.shared.open(link)
            }
        }
    }

    @IBAction func rocketLaunch(_ sender: Any) {
        if let link = URL(string: "https://www.youtube.com/watch?v=TZzabmiHfeU") {
            UIApplication.shared.open(link)
        }
    }

}

