"use client";
import Image from "next/image";
import styles from "./page.module.css";
// import { Navbar } from "@/components/common/Navbar";

import { useContext, useEffect, useState } from "react";
import $ from "jquery";
import { Hero } from "../components/home/Hero";
import { Card } from "../components/home/Card";
import { Footer } from "../components/common/Footer";
import { ContractContext } from "../Context/ContractContext";
import { Box } from "@mui/material";
import { useAccount } from "wagmi";
import { API_URL } from "../Config";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Manage } from "../components/modals/Manage";
import { Happend } from "../components/modals/Happend";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { Loader } from "../components/common/Loader";
import { Top_Corousel_Card } from "../components/home/Top_Corousel_Card";
import { Pagination } from "../components/home/Pagination";
// import { Profile } from "@/components/modals/Profile";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const arr2 = [1, 2, 3, 4, 5, 6];
const arr3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];



export default function Home() {
  const { address } = useAccount()

  const { coinData, crownData, followings, listedCoins, forYouCoins } = useContext(ContractContext);

  const [sortOption, setSortOption] = useState("1");
  const [pop, setPop] = useState("")
  const [c_page, setPage] = useState([])

  const handleSorting = (value) => {
    // console.warn("sect value is this " + value)
    setSortOption(value);
    // console.warn("after set")
  };



  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCoins, setFilteredCoins] = useState([]);
  // const [listedCoins, setListedCoins] = useState([]);

  const [tab, setTab] = useState("terminal");


  useEffect(() => {
    if (tab === "terminal" && coinData) {
      // Logic for terminal tab with coinData
      let filtered = coinData
        .filter((coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((coin) => coin.published === true);

      if (sortOption === "1") {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortOption === "2") {
        filtered.sort((a, b) => b.marketValue - a.marketValue);
      }

      setFilteredCoins(filtered);
    } else if (tab === "following" && followings) {
      // Logic for following tab with followings data
      let filtered = followings
        .flatMap((e) => e?.coinsData) // Flatten the coinsData arrays from followings
        .filter((coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((coin) => coin.published === true);

      if (sortOption === "1") {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortOption === "2") {
        filtered.sort((a, b) => b.marketValue - a.marketValue);
      }

      setFilteredCoins(filtered);
    } else {
      setFilteredCoins([]);
    }
  }, [searchQuery, coinData, followings, sortOption, tab]);

  // var flage = true
  // useEffect(() => {
  //   if (flage) {
  //     flage = false
  //     setTimeout(() => {
  //       setPop("manage")
  //     }, 5000);

  //   }
  // }, [])
  useEffect(() => {
    $("select").each(function () {
      var $this = $(this),
        numberOfOptions = $(this).children("option").length;

      $this.addClass("select-hidden");
      $this.wrap('<div class="select"></div>');
      $this.after('<div class="select-styled"></div>');

      var $styledSelect = $this.next("div.select-styled");
      $styledSelect.text($this.children("option").eq(0).text());

      var $list = $("<ul />", {
        class: "select-options",
      }).insertAfter($styledSelect);

      for (var i = 0; i < numberOfOptions; i++) {
        const value = $this.children("option").eq(i).val();
        $("<li />", {
          text: $this.children("option").eq(i).text(),
          rel: value,
          click: () => handleSorting(value)
        }).appendTo($list);
        if ($this.children("option").eq(i).is(":selected")) {
          $('li[rel="' + $this.children("option").eq(i).val() + '"]').addClass(
            "is-selected"
          );
        }
      }

      var $listItems = $list.children("li");

      $styledSelect.click(function (e) {
        e.stopPropagation();
        $("div.select-styled.active")
          .not(this)
          .each(function () {
            $(this).removeClass("active").next("ul.select-options").hide();
          });
        $(this).toggleClass("active").next("ul.select-options").toggle();
      });

      $listItems.click(function (e) {
        e.stopPropagation();
        $styledSelect.text($(this).text()).removeClass("active");
        $this.val($(this).attr("rel"));
        $list.find("li.is-selected").removeClass("is-selected");
        $list
          .find('li[rel="' + $(this).attr("rel") + '"]')
          .addClass("is-selected");
        $list.hide();
        //console.log($this.val());
      });

      $(document).click(function () {
        $styledSelect.removeClass("active");
        $list.hide();
      });
    });
  }, []);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: listedCoins.length < 3 ? listedCoins.length : 3,
    slidesToScroll: 3,
    initialSlide: 0,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          // infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // initialSlide: 2
        }
      }
      // {
      //   breakpoint: 480,
      //   settings: {
      //     slidesToShow: 1,
      //     slidesToScroll: 1,
      //     initialSlide: 1
      //   }
      // }
    ]
  };

  const settings1 = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 100,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1499,
        settings: {
          slidesToShow: 3.3
          
        }
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 3
          
        }
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2.5
          
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2
         
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1.85
      
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.55
      
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.35
      
        }
      },{
        breakpoint: 550,
        settings: {
          slidesToShow: 1.1
      
        }
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1
      
        }
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 0.8
      
        }
      }
    ]
  };

  const [latestTrade, setLatestTrade] = useState([]);
  const getTrades = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/get/latest/trades`,
    })
      .then((_data) => {
        setLatestTrade(_data.data.trades);
    
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };
  useEffect(()=>{
    getTrades()
  },[])
  return (
    <div className="home_bg">
      {/* <Navbar /> */}
      <div className={styles.tc + " py-3"}>
        {/* <div className={styles.track}>
          <Top_Corousel_Card />
          <Top_Corousel_Card />
          <Top_Corousel_Card />
          <Top_Corousel_Card />
          <Top_Corousel_Card />
          <Top_Corousel_Card />

        </div> */}
        <Slider {...settings1}>
          {latestTrade?.map((data,i)=>(
            <Top_Corousel_Card key={i} data={data}/>
          ))
           }
       
        </Slider>
      </div>
      <div>
        <Hero />
      </div>
      {
        listedCoins.length > 0 && tab === "terminal" &&
        <section className={styles.section2 + " px-lg-5 py-lg-5 px-sm-4 py-sm-4 px-2 py-4 my-3"}>
          <div className="d-flex justify-content-between">
            <h3 className="fs-6">Listed on Archerswap</h3>
            {/* <div>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide="prev"><i class="bi bi-chevron-left"></i></button>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide="next"><i class="bi bi-chevron-right"></i></button>
          </div> */}
          </div>
          <div className={styles.slider + " slider-container position-relative"}>
            {console.warn("listed coins ", listedCoins)}
            <Slider {...settings}>
              {listedCoins?.map((e, i) => <Card data={e} dex={true} setPop={setPop} />)}
            </Slider>
          </div>
        </section>
      }
      <section className={styles.section2 + " p-lg-4 py-4 px-md-2 px-4 p-xl-5"}>
        <div
          className={
            styles.filter +
            " d-flex flex-column-reverse gap-3 gap-md-0 flex-lg-row align-items-md-center justify-content-between"
          }
        >
          <div>
            <button
              className={tab === "following" ? "activefilter" : ""}
              onClick={() => { setTab("following") }}
            >
              Following
            </button>
            <button
              className={tab === "terminal" ? "activefilter" : ""}
              onClick={() => setTab("terminal")}
            >
              Terminal
            </button>
            <button
              className={tab === "for_you" ? "activefilter" : ""}
              onClick={() => { setTab("for_you") }}
            >
              For You
            </button>
          </div>
          <div
            className={
              styles.right +
              " d-flex flex-column flex-md-row gap-xl-5 gap-lg-4 gap-3"
            }
          >
            <div>
              <input
                type="text"
                placeholder="Search for Coins"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ height: "100%" }}
              />
              <button className="btn1 py-2 px-4">Search</button>
            </div>
            <Box
              sx={{
                "& .select": {
                  width: "240px",
                },
              }}
              className="d-flex gap-xl-4 gap-2"
            >
              {/* <select name="" id="sortby1">
                <option value="no">Sort by</option>
                <option value="lore">Lorem</option>
                <option value="lorem">Lorem</option>
                <option value="lorems">Lorem</option>
              </select> */}

              <select
                id="sortby1"
                value={sortOption}
                onChange={handleSorting}
              >
                {/* <option value="1">Sort: Featured</option> */}
                {/* <option value="2">Sort by: Bump Order</option> */}
                <option value="1">Sort by: Creation Time</option>
                {/* <option value="4">Sort by: Last Reply</option> */}
                {/* <option value="5">Sort by: Currently Live</option> */}
                <option value="2">Sort by: Market Cap</option>
                {/* <option value="1">Sort by: Recently Added</option>
                <option value="2">Sort by: Market Cap</option> */}
              </select>
            </Box>
          </div>
        </div>
        <div className="row mt-5 gap-xl-4 gap-3 justify-content-center">
          {tab === "terminal"
            ? filteredCoins?.map((e, i) => <Card data={e} setPop={setPop} />)
            : null}

          {tab === "following"
            ? filteredCoins?.map((coin, index) => (
              <Card data={coin} key={index} setPop={setPop} />
            ))
            : null}
          {tab === "for_you" ?
            forYouCoins.map((coin, index) => (
              <Card data={coin} key={index} setPop={setPop} />
            )) : null
          }
        </div>
        <Pagination stor={filteredCoins} page={setPage}/>
      </section>
      <Footer />
      {/* <Profile/> */}
      {/* <Manage/> */}
      {
        pop == "happend" ?
          <Happend setPop={setPop} /> : null
      }
      {
        pop == "manage" ?
          <Manage setPop={setPop} /> : null
      }
      {/* <Loader/> */}
    </div>
  );
}
