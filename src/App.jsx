
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "https://inai-col1.fishrungames.com/ads";
const API_BASE_URL = "https://inai-col1.fishrungames.com";

const fallbackImages = [
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
];

function getImageUrl(imageUrl, title, index) {
  if (imageUrl) {
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
  }

  if (title?.toLowerCase().includes("наушник")) {
    return fallbackImages[2];
  }

  return fallbackImages[index % fallbackImages.length];
}

function App() {
  const [ads, setAds] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAds() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Сервер ответил с ошибкой: ${response.status}`);
      }

      const data = await response.json();
      setAds(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error("Ошибка загрузки объявлений:", err);
      setError(
        "Не удалось загрузить объявления. Проверь подключение к интернету или доступность сервера."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAds();
  }, []);

  const filteredAds = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = ads.filter((ad) => {
      const title = (ad.title || "").toLowerCase();
      const description = (ad.description || "").toLowerCase();

      return title.includes(query) || description.includes(query);
    });

    if (sort === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [ads, search, sort]);

  function formatPrice(price) {
    return `${Number(price || 0).toLocaleString("ru-RU")} сом`;
  }

  function showDetails(ad, index) {
    const image = getImageUrl(ad.image_url, ad.title, index);

    window.alert(
      `${ad.title}\n\n${ad.description || "Описание отсутствует"}\n\nЦена: ${formatPrice(ad.price)}`
    );
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Lavanda — главная">
          <span className="brand-icon">l.</span>
          <span className="brand-name">lavanda</span>
        </a>

        <nav className="navigation">
          <a href="#home">Главная</a>
          <a href="#catalog">Каталог</a>
          <a href="#about">О проекте</a>
        </nav>

        <a className="header-action" href="#catalog">
          Найти вещь <span>↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              МЕСТО ДЛЯ ХОРОШИХ НАХОДОК
            </div>

            <h1>
              Любимые вещи.
              <br />
              <span>Новые истории.</span>
            </h1>

            <p className="hero-description">
              Открывай интересные предложения, находи полезные вещи
              и выбирай то, что подходит именно тебе.
            </p>

            <a className="primary-button" href="#catalog">
              Смотреть объявления <span>↗</span>
            </a>

            <div className="hero-note">
              <span className="note-heart">♡</span>
              Маленькие находки — большая радость
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-backdrop" />
            <div className="visual-sticker sticker-top">a little lovely</div>

            <div className="visual-photo">
              <img
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85"
                alt="Ноутбук на светлом столе"
              />
            </div>

            <div className="floating-card">
              <span className="floating-heart">♡</span>
              <div>
                <strong>Найди своё</strong>
                <span>Особенные вещи рядом</span>
              </div>
            </div>

            <div className="visual-sticker sticker-bottom">made with love ♡</div>
          </div>
        </section>

        <section className="catalog-section" id="catalog">
          <div className="catalog-top">
            <div>
              <p className="section-label">ТВОЯ СЛЕДУЮЩАЯ НАХОДКА</p>
              <h2>Свежие объявления<span>.</span></h2>
              <p className="section-description">
                Выбирай с удовольствием — возможно, нужная вещь уже здесь.
              </p>
            </div>

            <button
              className="refresh-button"
              type="button"
              onClick={fetchAds}
              disabled={loading}
            >
              <span className={loading ? "refresh-icon spinning" : "refresh-icon"}>
                ↻
              </span>
              Обновить
            </button>
          </div>

          <div className="catalog-tools">
            <label className="search-box">
              <span className="search-icon">⌕</span>
              <input
                type="search"
                placeholder="Что будем искать?"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Поиск объявлений"
              />
              {search && (
                <button
                  className="clear-search"
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Очистить поиск"
                >
                  ×
                </button>
              )}
            </label>

            <label className="sort-box">
              <span>Сортировка</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Сортировка объявлений"
              >
                <option value="newest">Сначала новые</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
              </select>
            </label>
          </div>

          <div className="results-line">
            <span>
              {loading
                ? "Загружаем находки…"
                : `Найдено объявлений: ${filteredAds.length}`}
            </span>
            <span className="results-decoration">curated for you ♡</span>
          </div>

          {loading && (
            <div className="status-panel">
              <div className="loader" />
              <p>Ищем красивые находки для тебя…</p>
            </div>
          )}

          {!loading && error && (
            <div className="status-panel error-panel">
              <span className="status-emoji">🌷</span>
              <h3>Пока не получилось загрузить объявления</h3>
              <p>{error}</p>
              <button className="primary-button" onClick={fetchAds} type="button">
                Попробовать снова
              </button>
            </div>
          )}

          {!loading && !error && filteredAds.length === 0 && (
            <div className="status-panel">
              <span className="status-emoji">♡</span>
              <h3>
                {ads.length === 0
                  ? "Объявлений пока нет"
                  : "Ничего не найдено"}
              </h3>
              <p>
                {ads.length === 0
                  ? "Новые предложения появятся здесь, когда они будут доступны на сервере."
                  : "Попробуй изменить запрос или очистить поиск."}
              </p>
              {search && (
                <button
                  className="secondary-button"
                  onClick={() => setSearch("")}
                  type="button"
                >
                  Очистить поиск
                </button>
              )}
            </div>
          )}

          {!loading && !error && filteredAds.length > 0 && (
            <div className="product-grid">
              {filteredAds.map((ad, index) => (
                <article className="product-card" key={ad.id}>
                  <button
                    className="product-image"
                    type="button"
                    onClick={() => showDetails(ad, index)}
                    aria-label={`Подробнее: ${ad.title}`}
                  >
                    <img
                      src={getImageUrl(ad.image_url, ad.title, index)}
                      alt={ad.title || "Фото товара"}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = fallbackImages[index % fallbackImages.length];
                      }}
                    />
                    <span className="product-badge">НАХОДКА ДНЯ</span>
                    <span className="image-arrow">↗</span>
                  </button>

                  <div className="product-info">
                    <div className="product-meta">
                      <span>ОБЪЯВЛЕНИЕ № {ad.id}</span>
                      <span className="product-heart">♡</span>
                    </div>

                    <h3>{ad.title}</h3>
                    <p className="product-description">
                      {ad.description || "Описание отсутствует"}
                    </p>

                    <div className="product-bottom">
                      <div>
                        <span className="price-label">Цена</span>
                        <strong className="product-price">
                          {formatPrice(ad.price)}
                        </strong>
                      </div>

                      <button
                        className="details-button"
                        type="button"
                        onClick={() => showDetails(ad, index)}
                      >
                        Подробнее <span>↗</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="about-banner" id="about">
          <div className="about-flower">✳</div>
          <div className="about-copy">
            <p className="section-label">ПОКУПАЙ С УДОВОЛЬСТВИЕМ</p>
            <h2>Хорошие вещи заслуживают новой истории.</h2>
            <p>
              Lavanda помогает находить интересные предложения в одном
              уютном пространстве.
            </p>
          </div>
          <a className="about-link" href="#catalog" aria-label="Перейти к объявлениям">
            ↗
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">l.</span>
          <span className="brand-name">lavanda</span>
        </a>
        <p>Пусть каждая находка будет особенной ♡</p>
        <span className="copyright">© 2026 Lavanda</span>
      </footer>
    </div>
  );
}

export default App;
