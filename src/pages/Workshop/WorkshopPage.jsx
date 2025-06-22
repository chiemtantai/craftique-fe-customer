import React from "react";
import { useNavigate } from "react-router-dom";
import "./WorkshopPage.css";

const WorkshopPage = () => {
  const navigate = useNavigate();

  return (
    <div className="workshop-container">
      <div className="workshop-content">
        <h1 className="workshop-title">Hướng dẫn đăng ký</h1>

        <div className="workshop-info">
          <div className="workshop-images">
            <div className="workshop-image">
              <img
                src="https://file.hstatic.net/1000382508/file/087122660230549_1593082397853331513_n_0f5c8632368044618d2a9e5eb7c1d8a6_grande.jpg"
                alt="Hình ảnh Workshop 1"
              />
            </div>
            <div className="workshop-image">
              <img
                src="https://file.hstatic.net/1000382508/file/087122730230542_2165593676557436854_n_d6210fba3dbc4d928e86e2d570df3b37_grande.jpg"
                alt="Hình ảnh Workshop 2"
              />
            </div>
            <div className="workshop-image">
              <img
                src="https://file.hstatic.net/1000382508/file/087122306897251_8183820834757168670_n_a256b047f2a34f25988e6b1d2a2483bb_grande.jpg"
                alt="Hình ảnh Workshop 3"
              />
            </div>
            <div className="workshop-image">
              <img
                src="https://file.hstatic.net/1000382508/file/087122283563920_7094128122954161960_n_f1884a1261f14837972e1449b21b697b_grande.jpg"
                alt="Hình ảnh Workshop 4"
              />
            </div>
          </div>

          <div className="workshop-details">
            <div className="workshop-description">
              <p>
                Tại Craftique, không gian rộng và ấm cúng, phù hợp tổ chức các
                buổi sinh hoạt nhóm, gia đình, teambuilding, sự kiện tham quan,
                trải nghiệm làm gốm...
              </p>
              <p>
                Đến với không gian trải nghiệm làm gốm thủ công tại Craftique,
                chúng ta sẽ được:
              </p>
              <ul>
                <li>
                  - Tham quan không gian Craftique, một không gian gốm Nam bộ
                  độc đáo
                </li>
                <li>
                  - Tham gia trải nghiệm tự tay làm gốm, nhờ về lần đầu góp, nặn
                  hình những ngôi nhà, thú gốm, sẵn phẩm yêu thích hoặc tự tay
                  xoay góm trên bàn xoay.
                </li>
              </ul>
            </div>

            <div className="contact-info-section">
              <p>
                <span className="label">Hotline:</span>{" "}
                <span className="hotline">0935736298</span> |{" "}
                <span className="label">Mail:</span>{" "}
                <a href="mailto:craftique68@gmail.com.vn" className="email">
                  Craftique68@gmail.com.vn
                </a>
              </p>
              <p>
                <span className="label">Fanpage:</span>{" "}
                <a href="#" className="link">
                  craftique.studio
                </a>{" "}
                |{" "}
                <a href="#" className="link">
                  craftique
                </a>
              </p>
              <p>
                <span className="label">Social Network:</span>{" "}
                <a href="#" className="link">
                  Instagram
                </a>{" "}
                |{" "}
                <a href="#" className="link">
                  Facebook
                </a>
              </p>
              <p>
                <span className="label">Bảng giá workshop:</span>{" "}
                <a href="#" className="price-link">
                  Bảng giá
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="register-section">
        <button
          className="register-button"
          onClick={() => navigate("/workshop/register")}
        >
          <span className="register-icon">📥</span>
          Đăng ký tại đây
        </button>
      </div>
    </div>
  );
};

export default WorkshopPage;
